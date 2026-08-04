import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// GET – list all customers
export async function GET() {
  try {
    const client = await clientPromise;
    if (!client) return NextResponse.json({ success: false, message: 'DB error' }, { status: 500 });
    const db = client.db('noelvisuals');
    const customers = await db.collection('customers').find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({
      success: true,
      customers: customers.map(c => ({
        _id: c._id.toString(),
        username: c.username,
        email: c.email,
        discordUserId: c.discordUserId,
        discordUsername: c.discordUsername,
        discordAvatar: c.discordAvatar,
        isVerified: c.isVerified,
        createdAt: c.createdAt,
      })),
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

// DELETE – delete a customer by _id
export async function DELETE(request: Request) {
  try {
    const { customerId } = await request.json();
    const client = await clientPromise;
    if (!client) return NextResponse.json({ success: false, message: 'DB error' }, { status: 500 });
    const db = client.db('noelvisuals');
    await db.collection('customers').deleteOne({ _id: new ObjectId(customerId) });
    return NextResponse.json({ success: true, message: 'Customer deleted.' });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}

// PATCH – reset password or re-verify a customer
export async function PATCH(request: Request) {
  try {
    const { customerId, action } = await request.json();
    const client = await clientPromise;
    if (!client) return NextResponse.json({ success: false, message: 'DB error' }, { status: 500 });
    const db = client.db('noelvisuals');

    if (action === 'reset_verification') {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      await db.collection('customers').updateOne(
        { _id: new ObjectId(customerId) },
        { $set: { isVerified: false, verificationCode: newCode } }
      );
      return NextResponse.json({ success: true, message: 'Verification reset. New code generated.', code: newCode });
    }

    if (action === 'force_verify') {
      await db.collection('customers').updateOne(
        { _id: new ObjectId(customerId) },
        { $set: { isVerified: true, verificationCode: null } }
      );
      return NextResponse.json({ success: true, message: 'Account manually verified.' });
    }

    return NextResponse.json({ success: false, message: 'Unknown action.' }, { status: 400 });
  } catch (e: any) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}
