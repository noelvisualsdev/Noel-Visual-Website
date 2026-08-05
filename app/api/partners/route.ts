import { NextResponse } from 'next/server';
import { getPartners, addPartner, deletePartner } from '@/lib/partners-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const partners = await getPartners();
    return NextResponse.json({ success: true, data: partners });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, logoUrl, websiteUrl, description, category, featured } = body;

    if (!name) {
      return NextResponse.json({ success: false, message: 'Name is required.' }, { status: 400 });
    }

    const partner = await addPartner({ name, logoUrl, websiteUrl, description, category, featured });
    return NextResponse.json({ success: true, data: partner });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ success: false, message: 'ID required' }, { status: 400 });

    const success = await deletePartner(id);
    return NextResponse.json({ success });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
