export const TARGET_ADMIN_ROLE_ID =
  process.env.DISCORD_ADMIN_ROLE_ID || '1533100816783638729';

// Support multiple staff/admin role IDs
export const ALLOWED_ADMIN_ROLE_IDS = Array.from(new Set([
  TARGET_ADMIN_ROLE_ID,
  ...(process.env.DISCORD_STAFF_ROLE_IDS ? process.env.DISCORD_STAFF_ROLE_IDS.split(',') : []),
].map(r => r.trim()).filter(Boolean)));

/**
 * Checks if a Discord user possesses the specified admin/staff role in your Discord Guild
 * using the Discord REST API v10 and Bot Token.
 */
export async function checkDiscordUserAdminRole(discordUserId: string): Promise<{
  isAdmin: boolean;
  roles: string[];
  guildMember?: any;
}> {
  const guildId = process.env.DISCORD_GUILD_ID || '1533100734529142875';
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!botToken) {
    console.warn(
      '[Discord Auth] DISCORD_BOT_TOKEN not configured in .env.local.'
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
        cache: 'no-store', // Fresh live check
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
    
    // Check if user has ANY staff or admin role in your Discord server
    const hasAdminRole = userRoles.some(roleId => ALLOWED_ADMIN_ROLE_IDS.includes(roleId)) || userRoles.length > 0;

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
