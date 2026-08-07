import { NextResponse } from 'next/server';
import { getMaintenanceMode, setMaintenanceMode } from '@/lib/settings-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const maintenanceMode = await getMaintenanceMode();
    return NextResponse.json({ success: true, maintenanceMode }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const enabled = Boolean(body.enabled);
    await setMaintenanceMode(enabled);
    return NextResponse.json({ success: true, maintenanceMode: enabled }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
