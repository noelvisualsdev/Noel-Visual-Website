import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { saveExternalMediaLocally } from './upload-helper';

export interface ProjectDocument {
  _id?: string;
  id?: string;
  type: string;
  clientId?: string;
  title: string;
  description: string;
  images: string[];
  videoUrl?: string;  // Direct video URL (mp4/webm etc.)
  channelId?: string;
  createdAt?: string;
  subtitle?: string;
  category?: string;
  client?: string;
}

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'projects.json');

function ensureProjectsFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
  }
}

export async function getProjects(): Promise<ProjectDocument[]> {
  // Query MongoDB Atlas collection 'projects' in database 'noelvisuals'
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const docs = await db.collection('projects').find({}).sort({ _id: -1 }).toArray();
      if (docs && docs.length > 0) {
        const DEFAULT_STUDIO_IMAGES = [
          '/images/featured_edit_city_nights.jpg',
          '/images/featured_edit_neon_cyber.jpg',
          '/images/featured_edit_brand_identity.jpg',
          '/images/featured_edit_thumbnail_art.jpg',
          '/images/og-image.png',
        ];

        return docs.map((doc, idx) => {
          let rawUrls: string[] = [];
          if (Array.isArray(doc.images)) {
            rawUrls = doc.images;
          } else if (typeof doc.images === 'string' && doc.images.trim()) {
            rawUrls = [doc.images.trim()];
          } else if (typeof doc.image === 'string' && doc.image.trim()) {
            rawUrls = [doc.image.trim()];
          }

          // Sanitize: Expired Discord CDN attachments (ex=... links) return 403 Forbidden for external visitors.
          // Replace expired Discord attachment links with permanent studio showcase images.
          const sanitizeUrl = (url: string, index: number, projType: string) => {
            if (!url) return '';
            if (url.includes('cdn.discordapp.com/attachments/') || url.includes('media.discordapp.net/attachments/')) {
              const lowerType = (projType || '').toLowerCase();
              if (lowerType.includes('thumb')) return '/images/featured_edit_thumbnail_art.jpg';
              if (lowerType.includes('brand') || lowerType.includes('design')) return '/images/featured_edit_brand_identity.jpg';
              if (lowerType.includes('cyber') || lowerType.includes('gaming')) return '/images/featured_edit_neon_cyber.jpg';
              return DEFAULT_STUDIO_IMAGES[index % DEFAULT_STUDIO_IMAGES.length];
            }
            return url;
          };

          const allUrls = rawUrls.map((u, i) => sanitizeUrl(u, idx + i, String(doc.type || '')));

          // Auto-detect: separate video URLs from image URLs
          const isVideoUrl = (url: string) =>
            Boolean(url && /\.(mp4|mov|webm|avi|mkv)(\?|$)/i.test(url.toLowerCase()));

          const imageUrls = allUrls.filter(u => u && !isVideoUrl(u));
          const videoUrls = allUrls.filter(u => u && isVideoUrl(u));

          const rawVideo = doc.videoUrl || doc.video;
          const sanitizedVideo = rawVideo && !rawVideo.includes('cdn.discordapp.com/attachments/')
            ? rawVideo
            : videoUrls[0] || undefined;

          // Thumbnail = first valid image OR studio fallback image
          const fallbackImg = DEFAULT_STUDIO_IMAGES[idx % DEFAULT_STUDIO_IMAGES.length];
          const thumbnail = imageUrls[0] || fallbackImg;

          return {
            _id: doc._id.toString(),
            id: doc._id.toString(),
            type: String(doc.type || 'work'),
            clientId: doc.clientId ? String(doc.clientId) : '',
            title: String(doc.title || 'Untitled Project'),
            description: String(doc.description || ''),
            image: thumbnail,
            images: imageUrls.length > 0 ? imageUrls : [thumbnail],
            videoUrl: sanitizedVideo,
            channelId: doc.channelId ? String(doc.channelId) : '',
            createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
            subtitle: String(doc.type || 'WORK SHOWCASE').toUpperCase(),
            category: String(doc.type || 'Editing'),
            client: doc.clientId ? `Client #${String(doc.clientId).slice(-4)}` : 'Verified Client',
          };
        });
      }
    } catch (e) {
      console.warn('[MongoDB] Projects query fallback:', e);
    }
  }

  // Fallback local storage
  ensureProjectsFile();
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function addProject(
  data: Omit<ProjectDocument, '_id' | 'id'>
): Promise<ProjectDocument> {
  // Automatically download temporary Discord/external media and save permanently on server
  const rawImages = data.images && data.images.length > 0 ? data.images : ['/images/featured_edit_city_nights.jpg'];
  const savedImages = await Promise.all(rawImages.map((img) => saveExternalMediaLocally(img)));
  const savedVideoUrl = data.videoUrl ? await saveExternalMediaLocally(data.videoUrl) : '';

  const newProject: Omit<ProjectDocument, '_id' | 'id'> = {
    type: data.type || 'work',
    clientId: data.clientId || '',
    title: data.title,
    description: data.description,
    images: savedImages,
    videoUrl: savedVideoUrl,
    channelId: data.channelId || '',
    createdAt: new Date().toISOString(),
  };

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const docToInsert = {
        ...newProject,
        createdAt: new Date(),
      };
      const res = await db.collection('projects').insertOne(docToInsert);
      return {
        ...newProject,
        _id: res.insertedId.toString(),
        id: res.insertedId.toString(),
      };
    } catch (e) {
      console.warn('[MongoDB] Project insert failed:', e);
    }
  }

  ensureProjectsFile();
  const projects = await getProjects();
  const fileProject = { ...newProject, id: `proj-${Date.now()}` };
  projects.unshift(fileProject);
  fs.writeFileSync(filePath, JSON.stringify(projects, null, 2), 'utf-8');
  return fileProject;
}

export async function deleteProject(id: string): Promise<boolean> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      let query: any = { id };
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { id }] };
      }
      const res = await db.collection('projects').deleteOne(query);
      if (res.deletedCount > 0) return true;
    } catch (e) {
      console.warn('[MongoDB] Project delete failed:', e);
    }
  }

  ensureProjectsFile();
  const projects = await getProjects();
  const filtered = projects.filter((p) => p.id !== id && p._id !== id);
  fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}
