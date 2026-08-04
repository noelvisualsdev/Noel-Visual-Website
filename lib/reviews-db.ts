import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';
import fs from 'fs';
import path from 'path';

export interface ReviewDocument {
  _id?: string;
  id?: string;
  userId: string;
  username: string;
  userAvatar: string;
  stars: number;
  text: string;
  createdAt?: string;
}

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'reviews.json');

function ensureReviewsFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
  }
}

export async function getReviews(): Promise<ReviewDocument[]> {
  // Query MongoDB Atlas collection 'reviews' in database 'noelvisuals'
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const docs = await db.collection('reviews').find({}).sort({ _id: -1 }).toArray();
      if (docs) {
        return docs.map((doc) => ({
          _id: doc._id.toString(),
          id: doc._id.toString(),
          userId: String(doc.userId || ''),
          username: String(doc.username || 'Discord User'),
          userAvatar: String(
            doc.userAvatar ||
              'https://cdn.discordapp.com/embed/avatars/0.png'
          ),
          stars: Number(doc.stars) || 5,
          text: String(doc.text || ''),
          createdAt: doc.createdAt
            ? new Date(doc.createdAt).toISOString()
            : new Date().toISOString(),
        }));
      }
    } catch (e) {
      console.warn('[MongoDB] Query fallback:', e);
    }
  }

  // Fallback to local JSON storage
  ensureReviewsFile();
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function addReview(
  data: Omit<ReviewDocument, '_id' | 'id'>
): Promise<ReviewDocument> {
  const newReview: ReviewDocument = {
    userId: data.userId,
    username: data.username,
    userAvatar: data.userAvatar,
    stars: Number(data.stars) || 5,
    text: data.text,
    createdAt: new Date().toISOString(),
  };

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const docToInsert = {
        userId: newReview.userId,
        username: newReview.username,
        userAvatar: newReview.userAvatar,
        stars: newReview.stars,
        text: newReview.text,
        createdAt: new Date(),
      };
      const res = await db.collection('reviews').insertOne(docToInsert);
      return {
        ...newReview,
        _id: res.insertedId.toString(),
        id: res.insertedId.toString(),
      };
    } catch (e) {
      console.warn('[MongoDB] Insert failed:', e);
    }
  }

  ensureReviewsFile();
  const reviews = await getReviews();
  const fileReview = { ...newReview, id: `rev-${Date.now()}` };
  reviews.unshift(fileReview);
  fs.writeFileSync(filePath, JSON.stringify(reviews, null, 2), 'utf-8');
  return fileReview;
}

export async function deleteReview(id: string): Promise<boolean> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      let query: any = { id };
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { id }] };
      }
      const res = await db.collection('reviews').deleteOne(query);
      if (res.deletedCount > 0) return true;
    } catch (e) {
      console.warn('[MongoDB] Review delete error:', e);
    }
  }

  ensureReviewsFile();
  const reviews = await getReviews();
  const filtered = reviews.filter((r) => r.id !== id && r._id !== id);
  fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}
