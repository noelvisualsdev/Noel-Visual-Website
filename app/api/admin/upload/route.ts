import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file) {
      return NextResponse.json({ success: false, message: 'Keine Datei ausgewählt.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Get extension
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
