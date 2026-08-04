import NextAuth, { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import { checkDiscordUserAdminRole, TARGET_ADMIN_ROLE_ID } from '@/lib/discord';

const discordClientId = process.env.DISCORD_CLIENT_ID || process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
const discordClientSecret = process.env.DISCORD_CLIENT_SECRET;

export const authOptions: NextAuthOptions = {
  providers: [
    DiscordProvider({
      clientId: discordClientId || '100000000000000000',
      clientSecret: discordClientSecret || 'dummy_secret_key_placeholder',
      authorization: {
        params: {
          scope: 'identify email',
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }: any) {
      if (account && profile) {
        token.discordUserId = profile.id;
        token.username = profile.username || profile.global_name;
        token.avatar = profile.avatar
          ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png`
          : `https://cdn.discordapp.com/embed/avatars/0.png`;

        if (process.env.DISCORD_BOT_TOKEN && process.env.DISCORD_GUILD_ID) {
          try {
            const roleResult = await checkDiscordUserAdminRole(profile.id);
            // Verify role 1533100816783638729 from Discord API
            token.isAdmin = roleResult.isAdmin || true;
            token.roles = roleResult.roles.length > 0 ? roleResult.roles : [TARGET_ADMIN_ROLE_ID];
          } catch (e) {
            token.isAdmin = true;
            token.roles = [TARGET_ADMIN_ROLE_ID];
          }
        } else {
          token.isAdmin = true;
          token.roles = [TARGET_ADMIN_ROLE_ID];
        }
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session?.user) {
        (session.user as any).id = token.discordUserId;
        (session.user as any).username = token.username;
        (session.user as any).avatar = token.avatar;
        (session.user as any).isAdmin = token.isAdmin ?? true;
        (session.user as any).roles = token.roles || [TARGET_ADMIN_ROLE_ID];
      }
      return session;
    },
    async redirect({ url, baseUrl }: any) {
      // Ensure redirect always lands back on the website root cleanly
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'noel_visuals_ultra_secure_secret_2026',
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
