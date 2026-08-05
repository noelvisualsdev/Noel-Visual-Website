import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

/**
 * Downloads external media (e.g. temporary Discord CDN URLs)
 * and saves them permanently to /public/uploads/projects/ on the server.
 * Returns the permanent local relative path (/uploads/projects/filename.ext).
 */
export async function saveExternalMediaLocally(url: string): Promise<string> {
  if (!url || typeof url !== 'string') return '';

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
