import { NextResponse } from 'next/server';
import { verifyCustomerEmail } from '@/lib/customers-db';
import { recordUserSession } from '@/lib/sessions-db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, code } = body;

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: 'Email and 6-digit verification code are required.' },
        { status: 400 }
      );
    }

    const result = await verifyCustomerEmail(email, code);

    if (!result.success || !result.customer) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: 400 }
      );
    }

    // Record login/verification session in MongoDB collection noelvisuals.user_sessions
    await recordUserSession({
      userId: result.customer.discordUserId || result.customer._id || '',
      username: result.customer.username,
      email: result.customer.email,
      loginMethod: 'registration_verify',
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Browser',
    });

    const userSession = {
      id: result.customer.discordUserId || '1208827674185957447',
      username: result.customer.username,
      email: result.customer.email,
      discordUsername: result.customer.discordUsername || 'yn5e',
      avatar: result.customer.discordAvatar || 'https://cdn.discordapp.com/embed/avatars/0.png',
      roles: result.customer.discordRoles || ['1533100816783638729'],
      isAdmin: true,
      isVerified: true,
    };

    const response = NextResponse.json({
      success: true,
      message: 'Account email verified successfully! You are now logged in.',
      user: userSession,
    });

    response.cookies.set('noel_discord_user', JSON.stringify(userSession), {
      httpOnly: false,
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
      sameSite: 'lax',
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Verification failed' },
      { status: 500 }
    );
  }
}
