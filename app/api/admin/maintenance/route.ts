import { NextResponse } from 'next/server';
import { getGeneralSettings, updateGeneralSettings, setMaintenanceMode } from '@/lib/settings-db';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  try {
    const settings = await getGeneralSettings();
    return NextResponse.json({
      success: true,
      maintenanceMode: settings.maintenanceMode,
      announcementText: settings.announcementText,
      announcementEnabled: settings.announcementEnabled,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const updateData: Record<string, any> = {};

    if (typeof body.enabled === 'boolean') {
      updateData.maintenanceMode = body.enabled;
    }
    if (typeof body.announcementText === 'string') {
      updateData.announcementText = body.announcementText;
    }
    if (typeof body.announcementEnabled === 'boolean') {
      updateData.announcementEnabled = body.announcementEnabled;
    }

    const updated = await updateGeneralSettings(updateData);
    return NextResponse.json({
      success: true,
      maintenanceMode: updated.maintenanceMode,
      announcementText: updated.announcementText,
      announcementEnabled: updated.announcementEnabled,
    }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
