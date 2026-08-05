import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export interface PartnerDocument {
  _id?: string;
  id?: string;
  name: string;
  logoUrl?: string;
  websiteUrl?: string;
  description?: string;
  category?: string;  // e.g. "Technology", "Creative", "Media"
  featured?: boolean;
  createdAt?: string;
}

export async function getPartners(): Promise<PartnerDocument[]> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const docs = await db.collection('partners').find({}).sort({ _id: -1 }).toArray();
      if (docs && docs.length > 0) {
        return docs.map((doc) => {
          const name = doc.name || doc.title || doc.partnerName || doc.username || 'Partner';
          const logoUrl = doc.logoUrl || doc.logo || doc.image || doc.avatar || doc.icon || '';
          const websiteUrl = doc.websiteUrl || doc.website || doc.url || doc.link || '';
          const description = doc.description || doc.desc || doc.bio || '';
          const category = doc.category || doc.type || 'Partner';

          return {
            _id: doc._id.toString(),
            id: doc._id.toString(),
            name: String(name),
            logoUrl: String(logoUrl),
            websiteUrl: String(websiteUrl),
            description: String(description),
            category: String(category),
            featured: Boolean(doc.featured),
            createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
          };
        });
      }
    } catch (e) {
      console.warn('[MongoDB] Partners query failed:', e);
    }
  }
  return [];
}

export async function addPartner(data: Omit<PartnerDocument, '_id' | 'id'>): Promise<PartnerDocument> {
  const newPartner = {
    name: data.name,
    logoUrl: data.logoUrl || '',
    websiteUrl: data.websiteUrl || '',
    description: data.description || '',
    category: data.category || 'Partner',
    featured: data.featured ?? false,
    createdAt: new Date(),
  };

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const res = await db.collection('partners').insertOne(newPartner);
      return { ...newPartner, _id: res.insertedId.toString(), id: res.insertedId.toString(), createdAt: newPartner.createdAt.toISOString() };
    } catch (e) {
      console.warn('[MongoDB] Partner insert failed:', e);
    }
  }
  return { ...newPartner, id: `partner-${Date.now()}`, createdAt: newPartner.createdAt.toISOString() };
}

export async function deletePartner(id: string): Promise<boolean> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      let query: any = { id };
      if (ObjectId.isValid(id)) {
        query = { $or: [{ _id: new ObjectId(id) }, { id }] };
      }
      const res = await db.collection('partners').deleteOne(query);
      if (res.deletedCount > 0) return true;
    } catch (e) {
      console.warn('[MongoDB] Partner delete failed:', e);
    }
  }
  return false;
}
