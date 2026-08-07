import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { saveBase64MediaLocally } from '@/lib/upload-helper';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const contentType = request.headers.get('content-type') || '';

    // Handle JSON payload (Base64 uploads)
    if (contentType.includes('application/json')) {
      const body = await request.json();
      const base64Data = body.base64 || body.file || body.data;
      if (!base64Data) {
        return NextResponse.json({ success: false, message: 'Kein Base64-Inhalt empfangen.' }, { status: 400 });
      }

      const savedUrl = saveBase64MediaLocally(base64Data);
      return NextResponse.json({
        success: true,
        url: savedUrl,
      }, { status: 200 });
    }

    // Handle Multipart FormData uploads
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'Keine Datei ausgewählt.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = file.name || 'upload.jpg';
    let ext = path.extname(originalName).toLowerCase();
    if (!ext) {
      if (file.type.includes('png')) ext = '.png';
      else if (file.type.includes('webp')) ext = '.webp';
      else if (file.type.includes('gif')) ext = '.gif';
      else if (file.type.includes('mp4')) ext = '.mp4';
      else if (file.type.includes('webm')) ext = '.webm';
      else ext = '.jpg';
    }

    const hash = crypto.createHash('md5').update(buffer).digest('hex').slice(0, 10);
    const filename = `proj_${Date.now()}_${hash}${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'projects');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/projects/${filename}`;
    console.log(`[UploadAPI] Saved file to ${publicUrl}`);

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename,
      size: file.size,
    });
  } catch (error: any) {
    console.error('[UploadAPI Error]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
