import clientPromise from './mongodb';
import fs from 'fs';
import path from 'path';

export interface InboundBrief {
  _id?: string;
  id: string;
  name: string;
  email: string;
  projectType: string;
  budgetRange: string;
  timeline: string;
  message: string;
  status: 'New Brief' | 'In Production' | 'Approved' | 'Completed';
  createdAt: string;
}

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'briefs.json');

function ensureDataFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
  }
}

export async function getBriefs(): Promise<InboundBrief[]> {
  // Query MongoDB Atlas collection 'tickets' in database 'noelvisuals'
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const docs = await db.collection('tickets').find({}).sort({ _id: -1 }).toArray();
      if (docs && docs.length > 0) {
        return docs.map((doc, idx) => ({
          _id: doc._id.toString(),
          id: doc.id || `TICKET-${doc._id.toString().slice(-6).toUpperCase()}`,
          name: String(doc.name || doc.username || 'Client'),
          email: String(doc.email || 'client@discord.gg'),
          projectType: String(doc.projectType || doc.service || 'Custom Work'),
          budgetRange: String(doc.budgetRange || doc.budget || 'Custom Quote'),
          timeline: String(doc.timeline || 'Flexible'),
          message: String(doc.message || doc.description || doc.text || ''),
          status: (doc.status as any) || 'New Brief',
          createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
        }));
      }
    } catch (e) {
      console.warn('[MongoDB] Tickets query fallback:', e);
    }
  }

  ensureDataFile();
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function saveBrief(
  data: Omit<InboundBrief, 'id' | 'status' | 'createdAt'>
): Promise<InboundBrief> {
  const newBriefData = {
    name: data.name,
    email: data.email,
    projectType: data.projectType,
    budgetRange: data.budgetRange,
    timeline: data.timeline,
    message: data.message,
    status: 'New Brief',
    createdAt: new Date().toISOString(),
  };

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const timestamp = Date.now();
      const randomSuffix = Math.floor(Math.random() * 1000000);
      const docToInsert = {
        ...newBriefData,
        id: `BR-${timestamp.toString().slice(-4)}`,
        channelId: `web-ticket-${timestamp}-${randomSuffix}`,
        ticketId: `web-ticket-${timestamp}-${randomSuffix}`,
        createdAt: new Date(),
      };
      const res = await db.collection('tickets').insertOne(docToInsert);
      return {
        ...newBriefData,
        id: docToInsert.id,
        _id: res.insertedId.toString(),
        status: 'New Brief' as const,
      };
    } catch (e) {
      console.warn('[MongoDB] Ticket insert failed:', e);
    }
  }

  ensureDataFile();
  const briefs = await getBriefs();
  const newId = `BR-${1050 + briefs.length}`;
  const newBrief: InboundBrief = {
    ...newBriefData,
    id: newId,
    status: 'New Brief',
  };

  briefs.unshift(newBrief);
  fs.writeFileSync(filePath, JSON.stringify(briefs, null, 2), 'utf-8');
  return newBrief;
}
