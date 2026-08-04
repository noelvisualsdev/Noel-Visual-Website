import { NextResponse } from 'next/server';
import { checkDiscordUserAdminRole, TARGET_ADMIN_ROLE_ID } from '@/lib/discord';
import { recordUserSession } from '@/lib/sessions-db';

const OWNER_DISCORD_ID = '1208827674185957447';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'noelvisuals.com';
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const baseUrl = (process.env.NEXTAUTH_URL || `${proto}://${host}`).trim().replace(/\/$/, '');

  const clientId = (process.env.DISCORD_CLIENT_ID || process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '').trim();
  const rawSecret = process.env.DISCORD_CLIENT_SECRET || '';
  const clientSecret = rawSecret.trim().replace(/^["']|["']$/g, '');
  
  const redirectUri = (process.env.DISCORD_REDIRECT_URI || `${baseUrl}/api/auth/discord/callback`).trim();

  if (!code) {
    return NextResponse.redirect(`${baseUrl}?error=no_code`);
  }

  if (!clientId || !clientSecret) {
    console.error('[Discord OAuth Error]: DISCORD_CLIENT_SECRET is missing in .env.local');
    return NextResponse.redirect(`${baseUrl}?error=missing_oauth_config`);
  }

  try {
    // 1. Token Exchange with Discord API
    const basicAuth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
    let tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${basicAuth}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      tokenResponse = await fetch('https://discord.com/api/oauth2/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: clientId,
          client_secret: clientSecret,
          grant_type: 'authorization_code',
          code: code,
          redirect_uri: redirectUri,
        }),
      });
    }

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error(`[Discord Token Exchange Error] redirectUri: ${redirectUri} | Error:`, errorText);
      return NextResponse.redirect(`${baseUrl}?error=token_exchange_failed`);
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // 2. Fetch User Profile (@me) from Discord
    const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userResponse.ok) {
      return NextResponse.redirect(`${baseUrl}?error=fetch_user_failed`);
    }

    const discordUser = await userResponse.json();

    // 3. Strict Admin Verification: Only owner (1208827674185957447) or admin role has isAdmin = true
    let isAdmin = discordUser.id === OWNER_DISCORD_ID;
    let roles: string[] = [];

    if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_GUILD_ID) {
      const roleResult = await checkDiscordUserAdminRole(discordUser.id);
      if (roleResult.isAdmin) {
        isAdmin = true;
      }
      if (roleResult.roles.length > 0) {
        roles = roleResult.roles;
      }
    }

    const avatarUrl = discordUser.avatar
      ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
      : `https://cdn.discordapp.com/embed/avatars/0.png`;

    // 4. Record real user session in MongoDB noelvisuals.user_sessions
    await recordUserSession({
      userId: discordUser.id,
      username: discordUser.username || discordUser.global_name || 'Discord User',
      email: discordUser.email || `${discordUser.username}@discord.gg`,
      loginMethod: 'discord_oauth',
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Browser',
    });

    return createLoggedSession(baseUrl, {
      id: discordUser.id,
      username: discordUser.username || discordUser.global_name || 'Discord User',
      globalName: discordUser.global_name || discordUser.username || 'Discord User',
      email: discordUser.email || '',
      avatar: avatarUrl,
      roles: roles,
      isAdmin: isAdmin,
    });
  } catch (error) {
    console.error('[Discord OAuth Callback Exception]:', error);
    return NextResponse.redirect(`${baseUrl}?error=oauth_exception`);
  }
}

function createLoggedSession(baseUrl: string, userData: any) {
  const userSession = {
    id: userData.id,
    username: userData.username,
    globalName: userData.globalName || userData.username,
    email: userData.email,
    avatar: userData.avatar,
    roles: userData.roles || [],
    isAdmin: userData.isAdmin ?? false,
  };

  const response = NextResponse.redirect(`${baseUrl}/`);
  response.cookies.set('noel_discord_user', JSON.stringify(userSession), {
    httpOnly: false,
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
  });

  return response;
}
