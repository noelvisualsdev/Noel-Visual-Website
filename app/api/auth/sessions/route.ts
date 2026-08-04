import { NextResponse } from 'next/server';
import { getUserSessions, recordUserSession } from '@/lib/sessions-db';

export async function GET() {
  try {
    const sessions = await getUserSessions();
    return NextResponse.json({ success: true, data: sessions }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, loginMethod, userId } = body;

    if (!username || !email) {
      return NextResponse.json(
        { success: false, message: 'Username and email are required.' },
        { status: 400 }
      );
    }

    const recorded = await recordUserSession({
      userId: userId || '',
      username,
      email,
      loginMethod: loginMethod || 'email_password',
      ipAddress: request.headers.get('x-forwarded-for') || '127.0.0.1',
      userAgent: request.headers.get('user-agent') || 'Browser',
    });

    return NextResponse.json({ success: true, data: recorded }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
