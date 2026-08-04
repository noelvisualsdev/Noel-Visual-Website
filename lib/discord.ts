export const TARGET_ADMIN_ROLE_ID =
  process.env.DISCORD_ADMIN_ROLE_ID || '1533100816783638729';

/**
 * Checks if a Discord user possesses the specified admin role in your Discord Guild
 * using the Discord REST API v10 and Bot Token.
 */
export async function checkDiscordUserAdminRole(discordUserId: string): Promise<{
  isAdmin: boolean;
  roles: string[];
  guildMember?: any;
}> {
  const guildId = process.env.DISCORD_GUILD_ID;
  const botToken = process.env.DISCORD_BOT_TOKEN;

  // Fallback check if environment variables are not yet configured in local dev
  if (!guildId || !botToken) {
    console.warn(
      '[Discord Auth] DISCORD_GUILD_ID or DISCORD_BOT_TOKEN not configured in .env.local.'
    );
    return { isAdmin: false, roles: [] };
  }

  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${guildId}/members/${discordUserId}`,
      {
        headers: {
          Authorization: `Bot ${botToken}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 60 }, // Cache role status for 60 seconds
      }
    );

    if (!response.ok) {
      console.error(
        `[Discord Auth] Failed to fetch guild member for ${discordUserId}. Status: ${response.status}`
      );
      return { isAdmin: false, roles: [] };
    }

    const memberData = await response.json();
    const userRoles: string[] = memberData.roles || [];
    const hasAdminRole = userRoles.includes(TARGET_ADMIN_ROLE_ID);

    return {
      isAdmin: hasAdminRole,
      roles: userRoles,
      guildMember: memberData,
    };
  } catch (error) {
    console.error('[Discord Auth Error]:', error);
    return { isAdmin: false, roles: [] };
  }
}
