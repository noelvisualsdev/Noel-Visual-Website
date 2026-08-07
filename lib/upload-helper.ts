import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Converts Base64 data URL (e.g. data:image/png;base64,iVBORw0KGgo...)
 * into a permanent file in /public/uploads/projects/ on the server.
 * Returns the relative path (/uploads/projects/filename.ext).
 */
export function saveBase64MediaLocally(base64Data: string): string {
  if (!base64Data || typeof base64Data !== 'string') return '';
  if (!base64Data.startsWith('data:')) return base64Data;

  try {
    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
    if (!matches || matches.length !== 3) return base64Data;

    const mimeType = matches[1];
    const base64String = matches[2];
    const buffer = Buffer.from(base64String, 'base64');

    let ext = '.jpg';
    if (mimeType.includes('png')) ext = '.png';
    else if (mimeType.includes('webp')) ext = '.webp';
    else if (mimeType.includes('gif')) ext = '.gif';
    else if (mimeType.includes('mp4')) ext = '.mp4';
    else if (mimeType.includes('webm')) ext = '.webm';

    const hash = crypto.createHash('md5').update(buffer).digest('hex').slice(0, 10);
    const filename = `proj_${Date.now()}_${hash}${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'projects');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    console.log(`[Base64MediaSaver] Saved base64 file to /uploads/projects/${filename}`);
    return `/uploads/projects/${filename}`;
  } catch (err) {
    console.error('[Base64MediaSaver] Error:', err);
    return base64Data;
  }
}

/**
 * Downloads external media (e.g. temporary Discord CDN URLs)
 * and saves them permanently to /public/uploads/projects/ on the server.
 * Returns the permanent local relative path (/uploads/projects/filename.ext).
 */
export async function saveExternalMediaLocally(url: string): Promise<string> {
  if (!url || typeof url !== 'string') return '';

  if (url.startsWith('data:')) {
    return saveBase64MediaLocally(url);
  }

  // If already a local relative path, return as is
  if (url.startsWith('/') || !url.startsWith('http')) {
    return url;
  }

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!res.ok) {
      console.warn(`[AutoMediaSaver] HTTP ${res.status} when fetching ${url}`);
      return url;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Determine extension
    let ext = '.jpg';
    const contentType = res.headers.get('content-type') || '';
    const lowerUrl = url.toLowerCase();

    if (contentType.includes('png') || lowerUrl.includes('.png')) ext = '.png';
    else if (contentType.includes('webp') || lowerUrl.includes('.webp')) ext = '.webp';
    else if (contentType.includes('gif') || lowerUrl.includes('.gif')) ext = '.gif';
    else if (contentType.includes('mp4') || lowerUrl.includes('.mp4')) ext = '.mp4';
    else if (contentType.includes('webm') || lowerUrl.includes('.webm')) ext = '.webm';
    else if (contentType.includes('mov') || lowerUrl.includes('.mov')) ext = '.mov';

    const hash = crypto.createHash('md5').update(buffer).digest('hex').slice(0, 10);
    const filename = `proj_${Date.now()}_${hash}${ext}`;

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads', 'projects');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    console.log(`[AutoMediaSaver] Saved external media to /uploads/projects/${filename}`);
    return `/uploads/projects/${filename}`;
  } catch (error) {
    console.warn('[AutoMediaSaver] Error saving media locally:', error);
    return url;
  }
}
