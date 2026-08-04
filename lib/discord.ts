// Staff/Admin role that grants access to the Admin Dashboard
export const TARGET_ADMIN_ROLE_ID = '1533100816783638729';

// The actual Discord Server (Guild) ID
export const GUILD_ID = '1533100734529142875';

/**
 * Checks if a Discord user has the Staff role (1533100816783638729)
 * in the Noel Visuals Discord server.
 */
export async function checkDiscordUserAdminRole(discordUserId: string): Promise<{
  isAdmin: boolean;
  roles: string[];
  guildMember?: any;
}> {
  const botToken = process.env.DISCORD_BOT_TOKEN;

  if (!botToken) {
    console.warn('[Discord Auth] DISCORD_BOT_TOKEN not set in .env.local');
    return { isAdmin: false, roles: [] };
  }

  try {
    const response = await fetch(
      `https://discord.com/api/v10/guilds/${GUILD_ID}/members/${discordUserId}`,
      {
        headers: {
          Authorization: `Bot ${botToken}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      console.warn(`[Discord Auth] Could not fetch member ${discordUserId}: ${response.status}`);
      return { isAdmin: false, roles: [] };
    }

    const memberData = await response.json();
    const userRoles: string[] = memberData.roles || [];

    // Grant admin dashboard access if user has the Staff role
    const hasStaffRole = userRoles.includes(TARGET_ADMIN_ROLE_ID);

    console.log(`[Discord Auth] User ${discordUserId} roles: [${userRoles.join(', ')}] | hasStaffRole: ${hasStaffRole}`);

    return {
      isAdmin: hasStaffRole,
      roles: userRoles,
      guildMember: memberData,
    };
  } catch (error) {
    console.error('[Discord Auth Error]:', error);
    return { isAdmin: false, roles: [] };
  }
}
