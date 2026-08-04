import { NextResponse } from 'next/server';
import { findCustomerByEmail, createCustomer } from '@/lib/customers-db';
import { sendVerificationEmail } from '@/lib/email-service';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, password, discordUserId, discordUsername, discordAvatar } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: 'Username, Email and Password are required.' },
        { status: 400 }
      );
    }

    if (!discordUserId) {
      return NextResponse.json(
        { success: false, message: 'You must link your Discord Account before registering.' },
        { status: 400 }
      );
    }

    // Check if account already exists
    const existing = await findCustomerByEmail(email);
    if (existing) {
      return NextResponse.json(
        { success: false, message: 'An account with this email address already exists.' },
        { status: 400 }
      );
    }

    // Generate 6-digit verification code
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

    // Create customer in MongoDB noelvisuals.customers
    await createCustomer({
      username: username,
      email: email,
      passwordHash: password,
      discordUserId: discordUserId,
      discordUsername: discordUsername || 'yn5e',
      discordAvatar: discordAvatar || 'https://cdn.discordapp.com/embed/avatars/0.png',
      discordRoles: ['1533100816783638729'],
      isVerified: false,
      verificationCode: verificationCode,
    });

    // Send REAL verification email via Nodemailer / SMTP
    const emailResult = await sendVerificationEmail(email, username, verificationCode);

    if (!emailResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: `Failed to send email: ${emailResult.message}. Please check your SMTP settings in .env.local!`,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: `A 6-digit verification code has been sent to ${email}. Please check your inbox.`,
        email: email,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Registration failed' },
      { status: 500 }
    );
  }
}
