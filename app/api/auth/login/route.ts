import { NextResponse } from 'next/server';
import { findCustomerByEmailOrUsername } from '@/lib/customers-db';
import { recordUserSession } from '@/lib/sessions-db';
import { checkDiscordUserAdminRole } from '@/lib/discord';

const OWNER_DISCORD_ID = '1208827674185957447';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = (body.loginEmail || body.email || body.identifier || '').trim();
    const password = (body.loginPassword || body.password || '').trim();

    if (!identifier || !password) {
      return NextResponse.json(
        { success: false, message: 'Bitte E-Mail-Adresse / Benutzername und Passwort eingeben.' },
        { status: 400 }
      );
    }

    const customer = await findCustomerByEmailOrUsername(identifier);
    if (!customer) {
      return NextResponse.json(
        { success: false, message: 'Kein Konto mit dieser E-Mail-Adresse oder Benutzername gefunden.' },
        { status: 401 }
      );
    }

    // Password check
    if (customer.passwordHash && customer.passwordHash !== password) {
      return NextResponse.json(
        { success: false, message: 'Ungültiges Passwort. Bitte versuche es erneut.' },
        { status: 401 }
      );
    }

    // Email verification check
    if (!customer.isVerified) {
      return NextResponse.json(
        {
          success: false,
          message: 'Dein Konto ist noch nicht verifiziert. Bitte verifiziere deine E-Mail-Adresse mit dem 6-stelligen Code.',
          requiresVerification: true,
        },
        { status: 403 }
      );
    }

    // Admin role check via Discord if discordUserId is present
    let isAdmin = false;
    let roles: string[] = customer.discordRoles || [];

    if (customer.discordUserId) {
      if (customer.discordUserId === OWNER_DISCORD_ID) {
        isAdmin = true;
      }
      try {
        const roleCheck = await checkDiscordUserAdminRole(customer.discordUserId);
        if (roleCheck.isAdmin) isAdmin = true;
        if (roleCheck.roles.length > 0) roles = roleCheck.roles;
      } catch (e) {
        console.warn('[Login Admin Check Warning]:', e);
      }
    }

    // Record login session in MongoDB
    await recordUserSession({
      userId: customer.discordUserId || customer._id || '',
      username: customer.username,
      email: customer.email,
      loginMethod: 'email_password',
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Browser',
    });

    const userSession = {
      id: customer.discordUserId || customer._id || `user_${Date.now()}`,
      username: customer.username,
      email: customer.email,
      discordUsername: customer.discordUsername || '',
      avatar: customer.discordAvatar || 'https://cdn.discordapp.com/embed/avatars/0.png',
      roles: roles,
      isAdmin: isAdmin,
      isVerified: true,
    };

    const response = NextResponse.json({
      success: true,
      message: 'Erfolgreich angemeldet!',
      user: userSession,
    });

    response.cookies.set('noel_discord_user', JSON.stringify(userSession), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Anmeldung fehlgeschlagen.' },
      { status: 500 }
    );
  }
}
