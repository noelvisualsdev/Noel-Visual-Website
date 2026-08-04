import clientPromise from './mongodb';
import { ObjectId } from 'mongodb';

export interface UserSessionDocument {
  _id?: string;
  id?: string;
  userId?: string;
  username: string;
  email: string;
  loginMethod: 'email_password' | 'discord_oauth' | 'registration_verify';
  ipAddress?: string;
  userAgent?: string;
  loginAt: string;
}

export async function recordUserSession(
  sessionData: Omit<UserSessionDocument, '_id' | 'id' | 'loginAt'>
): Promise<UserSessionDocument> {
  const newSession = {
    userId: sessionData.userId || '',
    username: sessionData.username,
    email: sessionData.email,
    loginMethod: sessionData.loginMethod,
    ipAddress: sessionData.ipAddress || '127.0.0.1',
    userAgent: sessionData.userAgent || 'Web Browser',
    loginAt: new Date().toISOString(),
  };

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const res = await db.collection('user_sessions').insertOne({
        ...newSession,
        createdAt: new Date(),
      });
      return {
        ...newSession,
        _id: res.insertedId.toString(),
        id: res.insertedId.toString(),
      };
    } catch (e) {
      console.warn('[MongoDB] recordUserSession error:', e);
    }
  }

  return { ...newSession, id: `sess-${Date.now()}` };
}

export async function getUserSessions(): Promise<UserSessionDocument[]> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const docs = await db.collection('user_sessions').find({}).sort({ _id: -1 }).toArray();
      if (docs && docs.length > 0) {
        return docs.map((doc) => ({
          _id: doc._id.toString(),
          id: doc._id.toString(),
          userId: doc.userId ? String(doc.userId) : '',
          username: String(doc.username || 'User'),
          email: String(doc.email || ''),
          loginMethod: doc.loginMethod || 'email_password',
          ipAddress: String(doc.ipAddress || '127.0.0.1'),
          userAgent: String(doc.userAgent || 'Web Browser'),
          loginAt: doc.loginAt ? new Date(doc.loginAt).toISOString() : new Date().toISOString(),
        }));
      }
    } catch (e) {
      console.warn('[MongoDB] getUserSessions query error:', e);
    }
  }

  return [];
}
