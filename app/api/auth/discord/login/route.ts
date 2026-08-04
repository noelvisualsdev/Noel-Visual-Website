import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const clientId = process.env.DISCORD_CLIENT_ID || process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  
  // Custom redirect URI or default
  const redirectUri = process.env.DISCORD_REDIRECT_URI || `${baseUrl}/api/auth/discord/callback`;

  if (!clientId || clientId === '100000000000000000') {
    return NextResponse.redirect(`${baseUrl}?error=missing_client_id`);
  }

  const discordAuthUrl = `https://discord.com/api/oauth2/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&response_type=code&scope=identify%20email`;

  return NextResponse.redirect(discordAuthUrl);
}
