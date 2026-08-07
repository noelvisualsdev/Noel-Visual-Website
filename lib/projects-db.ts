import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

export interface ProjectDocument {
  _id?: string;
  id?: string;
  type: string;
  clientId?: string;
  title: string;
  description: string;
  image?: string;
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

const DEFAULT_FALLBACK_IMAGE = '/images/featured_edit_city_nights.jpg';

export function normalizeMediaUrl(url?: string): string {
  if (!url || typeof url !== 'string') return DEFAULT_FALLBACK_IMAGE;
  let trimmed = url.trim();
  if (!trimmed) return DEFAULT_FALLBACK_IMAGE;

  // If it's an expired Discord CDN attachment link, fall back to showcase image
  if (trimmed.includes('cdn.discordapp.com/attachments/') || trimmed.includes('media.discordapp.net/attachments/')) {
    return DEFAULT_FALLBACK_IMAGE;
  }

  // Ensure relative URLs start with a leading slash '/'
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://') && !trimmed.startsWith('/')) {
    return '/' + trimmed;
  }

  return trimmed;
}

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
        return docs.map((doc) => {
          let rawUrls: string[] = [];
          if (Array.isArray(doc.images) && doc.images.length > 0) {
            rawUrls = doc.images.map((u: any) => String(u).trim()).filter(Boolean);
          } else if (typeof doc.image === 'string' && doc.image.trim()) {
            rawUrls = [doc.image.trim()];
          }

          const normalizedImages = rawUrls.map((u) => normalizeMediaUrl(u));
          const thumbnail = normalizedImages[0] || DEFAULT_FALLBACK_IMAGE;
          const normalizedVideo = doc.videoUrl ? normalizeMediaUrl(doc.videoUrl) : undefined;

          return {
            _id: doc._id.toString(),
            id: doc._id.toString(),
            type: String(doc.type || 'work'),
            clientId: doc.clientId ? String(doc.clientId) : '',
            title: String(doc.title || 'Untitled Project'),
            description: String(doc.description || ''),
            image: thumbnail,
            images: normalizedImages.length > 0 ? normalizedImages : [thumbnail],
            videoUrl: normalizedVideo !== DEFAULT_FALLBACK_IMAGE ? normalizedVideo : undefined,
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
    const parsed: ProjectDocument[] = JSON.parse(data);
    return parsed.map((p) => ({
      ...p,
      image: normalizeMediaUrl(p.image),
      images: Array.isArray(p.images) ? p.images.map((u) => normalizeMediaUrl(u)) : [DEFAULT_FALLBACK_IMAGE],
      videoUrl: p.videoUrl ? normalizeMediaUrl(p.videoUrl) : undefined,
    }));
  } catch (error) {
    return [];
  }
}

export async function addProject(
  data: Omit<ProjectDocument, '_id' | 'id'>
): Promise<ProjectDocument> {
  const rawImages = data.images && data.images.length > 0 ? data.images : [DEFAULT_FALLBACK_IMAGE];
  const normalizedImages = rawImages.map((u) => normalizeMediaUrl(u));
  const normalizedVideoUrl = data.videoUrl ? normalizeMediaUrl(data.videoUrl) : '';

  const newProject: Omit<ProjectDocument, '_id' | 'id'> = {
    type: data.type || 'work',
    clientId: data.clientId || '',
    title: data.title,
    description: data.description,
    images: normalizedImages,
    image: normalizedImages[0],
    videoUrl: normalizedVideoUrl !== DEFAULT_FALLBACK_IMAGE ? normalizedVideoUrl : '',
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

export async function updateProject(
  id: string,
  data: Partial<ProjectDocument>
): Promise<boolean> {
  const updateFields: any = { updatedAt: new Date() };

  if (data.title !== undefined) updateFields.title = data.title;
  if (data.type !== undefined) updateFields.type = data.type;
  if (data.description !== undefined) updateFields.description = data.description;

  if (data.images && data.images.length > 0) {
    const normalizedImages = data.images.map((u) => normalizeMediaUrl(u));
    updateFields.images = normalizedImages;
    updateFields.image = normalizedImages[0];
  } else if (data.image) {
    const normalizedImg = normalizeMediaUrl(data.image);
    updateFields.images = [normalizedImg];
    updateFields.image = normalizedImg;
  }

  if (data.videoUrl !== undefined) {
    const normalizedVid = data.videoUrl ? normalizeMediaUrl(data.videoUrl) : '';
    updateFields.videoUrl = normalizedVid !== DEFAULT_FALLBACK_IMAGE ? normalizedVid : '';
  }

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      let query: any = { id };
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { id }] };
      }
      const res = await db.collection('projects').updateOne(query, { $set: updateFields });
      if (res.modifiedCount > 0 || res.matchedCount > 0) return true;
    } catch (e) {
      console.warn('[MongoDB] Project update failed:', e);
    }
  }

  return false;
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
  let projects = await getProjects();
  projects = projects.filter((p) => p.id !== id && p._id !== id);
  fs.writeFileSync(filePath, JSON.stringify(projects, null, 2), 'utf-8');
  return true;
}
