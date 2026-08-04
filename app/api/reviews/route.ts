import { NextResponse } from 'next/server';
import { getReviews, addReview, deleteReview } from '@/lib/reviews-db';

export async function GET() {
  try {
    const reviews = await getReviews();
    return NextResponse.json({ success: true, data: reviews }, { status: 200 });
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

    if (!body.text || !body.username) {
      return NextResponse.json(
        { success: false, message: 'Missing required review fields.' },
        { status: 400 }
      );
    }

    const created = await addReview({
      userId: body.userId || '1533100816783638729',
      username: body.username,
      userAvatar: body.userAvatar || 'https://cdn.discordapp.com/embed/avatars/0.png',
      stars: Number(body.stars) || 5,
      text: body.text,
    });

    return NextResponse.json({ success: true, data: created }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, message: 'Review ID is required.' },
        { status: 400 }
      );
    }

    const deleted = await deleteReview(id);
    return NextResponse.json({ success: true, deleted }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
