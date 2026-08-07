import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;
    if (!filename || filename.includes('..')) {
      return new NextResponse('Invalid filename', { status: 400 });
    }

    const filePath = path.join(process.cwd(), 'public', 'uploads', 'projects', filename);

    if (!fs.existsSync(filePath)) {
      console.warn(`[UploadServer] File not found on disk: ${filePath}`);
      return new NextResponse('File Not Found', { status: 404 });
    }

    const fileBuffer = fs.readFileSync(filePath);
    const ext = path.extname(filename).toLowerCase();

    let contentType = 'image/jpeg';
    if (ext === '.png') contentType = 'image/png';
    else if (ext === '.webp') contentType = 'image/webp';
    else if (ext === '.gif') contentType = 'image/gif';
    else if (ext === '.svg') contentType = 'image/svg+xml';
    else if (ext === '.mp4') contentType = 'video/mp4';
    else if (ext === '.webm') contentType = 'video/webm';

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error: any) {
    console.error('[UploadServer Error]:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
