import { NextResponse } from 'next/server';
import { getGiveaways, addGiveaway, enterGiveaway, deleteGiveaway } from '@/lib/giveaways-db';

export async function GET() {
  try {
    const giveaways = await getGiveaways();
    return NextResponse.json({ success: true, data: giveaways }, { status: 200 });
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
    
    // Handle Giveaway Entry
    if (body.action === 'enter') {
      const { giveawayId, userIdentifier } = body;
      if (!giveawayId || !userIdentifier) {
        return NextResponse.json(
          { success: false, message: 'Giveaway ID and User Identifier required.' },
          { status: 400 }
        );
      }
      const res = await enterGiveaway(giveawayId, userIdentifier);
      return NextResponse.json(res, { status: 200 });
    }

    // Handle New Giveaway Creation
    if (!body.title || !body.prize) {
      return NextResponse.json(
        { success: false, message: 'Title and Prize are required.' },
        { status: 400 }
      );
    }

    const created = await addGiveaway({
      title: body.title,
      prize: body.prize,
      description: body.description || '',
      bannerImage: body.bannerImage || '/images/featured_edit_city_nights.jpg',
      status: body.status || 'active',
      endDate: body.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
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
        { success: false, message: 'Giveaway ID required.' },
        { status: 400 }
      );
    }

    const deleted = await deleteGiveaway(id);
    return NextResponse.json({ success: true, deleted }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
