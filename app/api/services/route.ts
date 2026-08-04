import { NextResponse } from 'next/server';
import { getServicesFromDb, addServiceToDb, deleteServiceFromDb } from '@/lib/services-db';
import { SERVICES_CATALOG } from '@/constants/services';

export async function GET() {
  try {
    let services = await getServicesFromDb();

    // If MongoDB collection is empty, seed initial 7 services into noelvisuals.services!
    if (services.length === 0) {
      for (const service of SERVICES_CATALOG) {
        await addServiceToDb({
          slug: service.slug,
          title: service.title,
          shortDescription: service.shortDescription,
          fullDescription: service.fullDescription,
          iconName: service.iconName,
          benefits: service.benefits,
          deliverables: service.deliverables,
          deliverTime: service.deliverTime,
          featured: service.featured ?? true,
        });
      }
      services = await getServicesFromDb();
    }

    return NextResponse.json({ success: true, data: services }, { status: 200 });
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
    if (!body.title || !body.shortDescription) {
      return NextResponse.json(
        { success: false, message: 'Title and short description are required.' },
        { status: 400 }
      );
    }

    const created = await addServiceToDb({
      slug: body.slug || body.title.toLowerCase().replace(/\s+/g, '-'),
      title: body.title,
      shortDescription: body.shortDescription,
      fullDescription: body.fullDescription || body.shortDescription,
      iconName: body.iconName || 'Zap',
      benefits: Array.isArray(body.benefits) ? body.benefits : ['High Quality', 'Fast Turnaround'],
      deliverables: Array.isArray(body.deliverables) ? body.deliverables : ['4K Master Export', 'Source File'],
      deliverTime: body.deliverTime || '24-48 Hours',
      featured: true,
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
        { success: false, message: 'Service ID is required.' },
        { status: 400 }
      );
    }

    const deleted = await deleteServiceFromDb(id);
    return NextResponse.json({ success: true, deleted }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
