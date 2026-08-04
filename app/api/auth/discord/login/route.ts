import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('mode') || 'login';
  const clientId = (process.env.DISCORD_CLIENT_ID || process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID || '').trim();
  
  const host = request.headers.get('x-forwarded-host') || request.headers.get('host') || 'noelvisuals.com';
  const proto = request.headers.get('x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
  const baseUrl = (process.env.NEXTAUTH_URL || `${proto}://${host}`).trim().replace(/\/$/, '');

  const redirectUri = (process.env.DISCORD_REDIRECT_URI || `${baseUrl}/api/auth/discord/callback`).trim();

  if (!clientId || clientId === '100000000000000000') {
    return NextResponse.redirect(`${baseUrl}?error=missing_client_id`);
  }

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=identify%20email&state=${encodeURIComponent(mode)}`;

  return NextResponse.redirect(discordAuthUrl);
}
