import { NextResponse } from 'next/server';
import { getProjects, addProject, deleteProject } from '@/lib/projects-db';

export async function GET() {
  try {
    const projects = await getProjects();
    return NextResponse.json({ success: true, data: projects }, { status: 200 });
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
    if (!body.title || !body.description) {
      return NextResponse.json(
        { success: false, message: 'Missing required project title or description.' },
        { status: 400 }
      );
    }

    const created = await addProject({
      type: body.type || 'work',
      clientId: body.clientId || '865289707328110662',
      title: body.title,
      description: body.description,
      images: Array.isArray(body.images) ? body.images : [body.images || '/images/featured_edit_city_nights.jpg'],
      channelId: body.channelId || '1533120649856417924',
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
        { success: false, message: 'Project ID is required.' },
        { status: 400 }
      );
    }

    const deleted = await deleteProject(id);
    return NextResponse.json({ success: true, deleted }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
