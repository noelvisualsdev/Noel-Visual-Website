const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const uri = 'mongodb+srv://moritznathan26_db_user:dUGXnPPclGEbSZxs@noelvisuals.zdsvpvc.mongodb.net/?appName=Noelvisuals';

async function saveMediaLocally(url) {
  if (!url || typeof url !== 'string' || !url.startsWith('http')) return url;

  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
      },
    });

    if (!res.ok) {
      console.log(`Failed to fetch ${url}: HTTP ${res.status}`);
      return url;
    }

    const arrayBuffer = await res.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    let ext = '.jpg';
    const contentType = res.headers.get('content-type') || '';
    const lower = url.toLowerCase();

    if (contentType.includes('png') || lower.includes('.png')) ext = '.png';
    else if (contentType.includes('webp') || lower.includes('.webp')) ext = '.webp';
    else if (contentType.includes('gif') || lower.includes('.gif')) ext = '.gif';
    else if (contentType.includes('mp4') || lower.includes('.mp4')) ext = '.mp4';
    else if (contentType.includes('webm') || lower.includes('.webm')) ext = '.webm';

    const hash = crypto.createHash('md5').update(buffer).digest('hex').slice(0, 10);
    const filename = `proj_${Date.now()}_${hash}${ext}`;

    const uploadsDir = path.join(__dirname, '..', 'public', 'uploads', 'projects');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, filename);
    fs.writeFileSync(filePath, buffer);

    console.log(`[SAVED] ${url} -> /uploads/projects/${filename}`);
    return `/uploads/projects/${filename}`;
  } catch (err) {
    console.error(`Error downloading ${url}:`, err.message);
    return url;
  }
}

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    console.log('Connected to MongoDB Atlas...');
    const db = client.db('noelvisuals');
    const projects = await db.collection('projects').find({}).toArray();

    console.log(`Found ${projects.length} projects in database.`);

    for (const proj of projects) {
      console.log(`Processing project: "${proj.title}" (${proj._id})`);
      let changed = false;
      const rawImages = Array.isArray(proj.images) ? proj.images : (proj.image ? [proj.image] : []);
      const newImages = [];

      for (const imgUrl of rawImages) {
        const saved = await saveMediaLocally(imgUrl);
        newImages.push(saved);
        if (saved !== imgUrl) changed = true;
      }

      let newVideoUrl = proj.videoUrl;
      if (proj.videoUrl && proj.videoUrl.startsWith('http')) {
        const savedVid = await saveMediaLocally(proj.videoUrl);
        if (savedVid !== proj.videoUrl) {
          newVideoUrl = savedVid;
          changed = true;
        }
      }

      if (changed) {
        await db.collection('projects').updateOne(
          { _id: proj._id },
          {
            $set: {
              images: newImages,
              image: newImages[0] || proj.image,
              videoUrl: newVideoUrl,
              updatedAt: new Date(),
            },
          }
        );
        console.log(`[UPDATED DB] Project "${proj.title}" updated.`);
      }
    }
    console.log('Migration complete!');
  } catch (e) {
    console.error('Migration failed:', e);
  } finally {
    await client.close();
  }
}

run();
