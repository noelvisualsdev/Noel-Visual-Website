import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

export interface GiveawayDocument {
  _id?: string;
  id?: string;
  title: string;
  prize: string;
  description: string;
  bannerImage?: string;
  status: 'active' | 'ended';
  endDate: string;
  participantsCount?: number;
  entries?: string[]; // Array of Discord User IDs or emails
  createdAt?: string;
}

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'giveaways.json');

function ensureGiveawaysFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
  }
}

export async function getGiveaways(): Promise<GiveawayDocument[]> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const docs = await db.collection('giveaways').find({}).sort({ _id: -1 }).toArray();
      if (docs && docs.length > 0) {
        return docs.map((doc) => ({
          _id: doc._id.toString(),
          id: doc._id.toString(),
          title: String(doc.title || 'Studio Giveaway'),
          prize: String(doc.prize || 'Free Edit Package'),
          description: String(doc.description || ''),
          bannerImage: doc.bannerImage || '/images/featured_edit_city_nights.jpg',
          status: doc.status === 'ended' ? 'ended' : 'active',
          endDate: doc.endDate ? new Date(doc.endDate).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
          participantsCount: Array.isArray(doc.entries) ? doc.entries.length : Number(doc.participantsCount) || 0,
          entries: Array.isArray(doc.entries) ? doc.entries : [],
          createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
        }));
      }
    } catch (e) {
      console.warn('[MongoDB] Giveaways query error:', e);
    }
  }

  ensureGiveawaysFile();
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (e) {
    return [];
  }
}

export async function addGiveaway(
  data: Omit<GiveawayDocument, '_id' | 'id'>
): Promise<GiveawayDocument> {
  const newGiveaway = {
    title: data.title,
    prize: data.prize,
    description: data.description,
    bannerImage: data.bannerImage || '/images/featured_edit_city_nights.jpg',
    status: data.status || 'active',
    endDate: data.endDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    participantsCount: 0,
    entries: [],
    createdAt: new Date().toISOString(),
  };

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const res = await db.collection('giveaways').insertOne({
        ...newGiveaway,
        createdAt: new Date(),
      });
      return {
        ...newGiveaway,
        _id: res.insertedId.toString(),
        id: res.insertedId.toString(),
      };
    } catch (e) {
      console.warn('[MongoDB] Giveaway insert error:', e);
    }
  }

  ensureGiveawaysFile();
  const giveaways = await getGiveaways();
  const fileGiveaway = { ...newGiveaway, id: `give-${Date.now()}` };
  giveaways.unshift(fileGiveaway);
  fs.writeFileSync(filePath, JSON.stringify(giveaways, null, 2), 'utf-8');
  return fileGiveaway;
}

export async function enterGiveaway(
  giveawayId: string,
  userIdOrEmail: string
): Promise<{ success: boolean; message: string }> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const filter = ObjectId.isValid(giveawayId) ? { _id: new ObjectId(giveawayId) } : { id: giveawayId };

      await db.collection('giveaways').updateOne(filter, {
        $addToSet: { entries: userIdOrEmail },
        $inc: { participantsCount: 1 },
      });
      return { success: true, message: 'You have entered the giveaway successfully!' };
    } catch (e: any) {
      return { success: false, message: e.message || 'Failed to enter giveaway.' };
    }
  }

  return { success: true, message: 'Entered giveaway (local memory).' };
}

export async function deleteGiveaway(id: string): Promise<boolean> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      let query: any = { id };
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { id }] };
      }
      const res = await db.collection('giveaways').deleteOne(query);
      if (res.deletedCount > 0) return true;
    } catch (e) {
      console.warn('[MongoDB] Giveaway delete error:', e);
    }
  }

  ensureGiveawaysFile();
  const giveaways = await getGiveaways();
  const filtered = giveaways.filter((g) => g.id !== id && g._id !== id);
  fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}
