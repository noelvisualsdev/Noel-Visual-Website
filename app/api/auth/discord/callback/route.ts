import { NextResponse } from 'next/server';
import { checkDiscordUserAdminRole, TARGET_ADMIN_ROLE_ID } from '@/lib/discord';
import { recordUserSession } from '@/lib/sessions-db';

const OWNER_DISCORD_ID = '1208827674185957447';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const state = searchParams.get('state') || '';

  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'noelvisuals.com';
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const baseUrl = (process.env.NEXTAUTH_URL || `${proto}://${host}`).trim().replace(/\/$/, '');

  const clientId = (process.env.DISCORD_CLIENT_ID || process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '').trim();
  const rawSecret = process.env.DISCORD_CLIENT_SECRET || '';
  const clientSecret = rawSecret.trim().replace(/^["']|["']$/g, '');

  if (!code) {
    return NextResponse.redirect(`${baseUrl}/`);
  }

  // Candidate redirect URIs to guarantee matching Discord app settings
  const redirectCandidates = Array.from(new Set([
    process.env.DISCORD_REDIRECT_URI,
    `${baseUrl}/api/auth/discord/callback`,
    `https://noelvisuals.com/api/auth/discord/callback`,
    `https://www.noelvisuals.com/api/auth/discord/callback`,
    `http://localhost:3000/api/auth/discord/callback`,
  ].filter(Boolean) as string[]));

  let accessToken: string | null = null;
  let lastErrorText = '';

  if (clientId && clientSecret) {
    for (const rUri of redirectCandidates) {
      try {
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
            redirect_uri: rUri,
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
              redirect_uri: rUri,
            }),
          });
        }

        if (tokenResponse.ok) {
          const tokenData = await tokenResponse.json();
          accessToken = tokenData.access_token;
          break;
        } else {
          lastErrorText = await tokenResponse.text();
        }
      } catch (err: any) {
        lastErrorText = err.message;
      }
    }
  }

  // If token exchange was successful with access_token
  if (accessToken) {
    try {
      const userResponse = await fetch('https://discord.com/api/v10/users/@me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (userResponse.ok) {
        const discordUser = await userResponse.json();
        const avatarUrl = discordUser.avatar
          ? `https://cdn.discordapp.com/avatars/${discordUser.id}/${discordUser.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/0.png`;

        // link_only mode: return Discord data to the registration page without logging in
        if (state === 'link_only') {
          const params = new URLSearchParams({
            discord_id: discordUser.id,
            discord_username: discordUser.username || discordUser.global_name || 'User',
            discord_avatar: avatarUrl,
            discord_linked: '1',
          });
          return NextResponse.redirect(`${baseUrl}/?${params.toString()}`);
        }

        let isAdmin = discordUser.id === OWNER_DISCORD_ID;
        let roles: string[] = [];

        if (process.env.DISCORD_BOT_TOKEN) {
          const roleResult = await checkDiscordUserAdminRole(discordUser.id);
          if (roleResult.isAdmin) isAdmin = true;
          if (roleResult.roles.length > 0) roles = roleResult.roles;
        }

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
      }
    } catch (e) {
      console.warn('[Discord Fetch User Error]:', e);
    }
  }

  console.warn('[Discord OAuth Fallback Triggered]: Token exchange failed. Error:', lastErrorText);
  // Do NOT create a fake session — just redirect home with an error flag
  return NextResponse.redirect(`${baseUrl}/?discord_error=1`);
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
