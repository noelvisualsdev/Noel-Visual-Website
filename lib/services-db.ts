import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export interface ServiceDocument {
  _id?: string;
  id?: string;
  slug: string;
  title: string;
  shortDescription: string;
  fullDescription: string;
  iconName: string;
  benefits: string[];
  deliverables: string[];
  deliverTime: string;
  featured: boolean;
  createdAt?: string;
}

export async function getServicesFromDb(): Promise<ServiceDocument[]> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const docs = await db.collection('services').find({}).sort({ _id: 1 }).toArray();
      if (docs && docs.length > 0) {
        return docs.map((doc) => ({
          _id: doc._id.toString(),
          id: doc._id.toString(),
          slug: String(doc.slug || 'service'),
          title: String(doc.title || 'Untitled Service'),
          shortDescription: String(doc.shortDescription || ''),
          fullDescription: String(doc.fullDescription || ''),
          iconName: String(doc.iconName || 'Zap'),
          benefits: Array.isArray(doc.benefits) ? doc.benefits : [],
          deliverables: Array.isArray(doc.deliverables) ? doc.deliverables : [],
          deliverTime: String(doc.deliverTime || '24-48 Hours'),
          featured: doc.featured ?? true,
          createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
        }));
      }
    } catch (e) {
      console.warn('[MongoDB] Services query error:', e);
    }
  }

  return [];
}

export async function addServiceToDb(
  data: Omit<ServiceDocument, '_id' | 'id'>
): Promise<ServiceDocument> {
  const newService = {
    slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-'),
    title: data.title,
    shortDescription: data.shortDescription,
    fullDescription: data.fullDescription,
    iconName: data.iconName || 'Zap',
    benefits: data.benefits || [],
    deliverables: data.deliverables || [],
    deliverTime: data.deliverTime || '24-48 Hours',
    featured: data.featured ?? true,
    createdAt: new Date().toISOString(),
  };

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const res = await db.collection('services').insertOne({
        ...newService,
        createdAt: new Date(),
      });
      return {
        ...newService,
        _id: res.insertedId.toString(),
        id: res.insertedId.toString(),
      };
    } catch (e) {
      console.warn('[MongoDB] Service insert error:', e);
    }
  }

  return { ...newService, id: `serv-${Date.now()}` };
}

export async function deleteServiceFromDb(id: string): Promise<boolean> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      let query: any = { id };
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { id }] };
      }
      const res = await db.collection('services').deleteOne(query);
      if (res.deletedCount > 0) return true;
    } catch (e) {
      console.warn('[MongoDB] Service delete error:', e);
    }
  }
  return true;
}
