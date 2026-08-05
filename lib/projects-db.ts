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
        return docs.map((doc) => {
          let allUrls: string[] = [];
          if (Array.isArray(doc.images)) {
            allUrls = doc.images;
          } else if (typeof doc.images === 'string' && doc.images.trim()) {
            allUrls = [doc.images.trim()];
          } else if (typeof doc.image === 'string' && doc.image.trim()) {
            allUrls = [doc.image.trim()];
          }

          // Auto-detect: separate video URLs from image URLs
          const isVideoUrl = (url: string) =>
            Boolean(url && /\.(mp4|mov|webm|avi|mkv)(\?|$)/i.test(url.toLowerCase()));

          const imageUrls = allUrls.filter(u => !isVideoUrl(u));
          const videoUrls = allUrls.filter(u => isVideoUrl(u));

          // Use explicit videoUrl field OR first detected video URL
          const videoUrl = doc.videoUrl || doc.video || videoUrls[0] || undefined;
          // Thumbnail = explicit image OR first image URL OR fallback
          const thumbnail = imageUrls[0] || (allUrls.length > 0 ? allUrls[0] : '/images/featured_edit_city_nights.jpg');

          return {
            _id: doc._id.toString(),
            id: doc._id.toString(),
            type: String(doc.type || 'work'),
            clientId: doc.clientId ? String(doc.clientId) : '',
            title: String(doc.title || 'Untitled Project'),
            description: String(doc.description || ''),
            image: thumbnail,
            images: imageUrls.length > 0 ? imageUrls : [thumbnail],
            videoUrl: videoUrl,
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
  const newProject: Omit<ProjectDocument, '_id' | 'id'> = {
    type: data.type || 'work',
    clientId: data.clientId || '',
    title: data.title,
    description: data.description,
    images: data.images && data.images.length > 0 ? data.images : ['/images/featured_edit_city_nights.jpg'],
    videoUrl: data.videoUrl || '',
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
