import clientPromise from './mongodb';
import fs from 'fs';
import path from 'path';

export interface CustomerDocument {
  _id?: string;
  id?: string;
  username: string;
  email: string;
  passwordHash?: string;
  discordUserId?: string;
  discordUsername?: string;
  discordAvatar?: string;
  discordRoles?: string[];
  isVerified: boolean;
  verificationCode?: string;
  verificationExpiresAt?: string;
  createdAt: string;
}

const dataDir = path.join(process.cwd(), 'data');
const filePath = path.join(dataDir, 'customers.json');

function ensureCustomersFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), 'utf-8');
  }
}

export async function findCustomerByEmail(email: string): Promise<CustomerDocument | null> {
  return findCustomerByEmailOrUsername(email);
}

export async function findCustomerByEmailOrUsername(identifier: string): Promise<CustomerDocument | null> {
  const normalized = identifier.toLowerCase().trim();

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const doc = await db.collection('customers').findOne({
        $or: [
          { email: normalized },
          { username: { $regex: new RegExp(`^${normalized}$`, 'i') } }
        ]
      });
      if (doc) {
        return {
          _id: doc._id.toString(),
          id: doc._id.toString(),
          username: doc.username,
          email: doc.email,
          passwordHash: doc.passwordHash,
          discordUserId: doc.discordUserId,
          discordUsername: doc.discordUsername,
          discordAvatar: doc.discordAvatar,
          discordRoles: doc.discordRoles || [],
          isVerified: doc.isVerified ?? false,
          verificationCode: doc.verificationCode,
          verificationExpiresAt: doc.verificationExpiresAt,
          createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : new Date().toISOString(),
        };
      }
    } catch (e) {
      console.warn('[MongoDB] Find customer error:', e);
    }
  }

  ensureCustomersFile();
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const customers: CustomerDocument[] = JSON.parse(data);
    return customers.find(
      (c) => c.email.toLowerCase() === normalized || c.username.toLowerCase() === normalized
    ) || null;
  } catch (e) {
    return null;
  }
}

export async function createCustomer(
  data: Omit<CustomerDocument, '_id' | 'id' | 'createdAt'>
): Promise<CustomerDocument> {
  const newCustomer = {
    username: data.username.trim(),
    email: data.email.toLowerCase().trim(),
    passwordHash: data.passwordHash || '',
    discordUserId: data.discordUserId || '',
    discordUsername: data.discordUsername || '',
    discordAvatar: data.discordAvatar || '',
    discordRoles: data.discordRoles || [],
    isVerified: data.isVerified ?? false,
    verificationCode: data.verificationCode || Math.floor(100000 + Math.random() * 900000).toString(),
    verificationExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
    createdAt: new Date().toISOString(),
  };

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const res = await db.collection('customers').insertOne({
        ...newCustomer,
        createdAt: new Date(),
      });
      return {
        ...newCustomer,
        _id: res.insertedId.toString(),
        id: res.insertedId.toString(),
      };
    } catch (e) {
      console.warn('[MongoDB] Customer insert error:', e);
    }
  }

  ensureCustomersFile();
  const dataStore = fs.readFileSync(filePath, 'utf-8');
  const customers: CustomerDocument[] = JSON.parse(dataStore);
  const fileCustomer = { ...newCustomer, id: `cust-${Date.now()}` };
  customers.unshift(fileCustomer);
  fs.writeFileSync(filePath, JSON.stringify(customers, null, 2), 'utf-8');
  return fileCustomer;
}

export async function verifyCustomerEmail(
  email: string,
  code: string
): Promise<{ success: boolean; message: string; customer?: CustomerDocument }> {
  const customer = await findCustomerByEmail(email);
  if (!customer) {
    return { success: false, message: 'No account found with this email address.' };
  }

  if (customer.isVerified) {
    return { success: true, message: 'Account is already verified.', customer };
  }

  if (customer.verificationCode !== code.trim()) {
    return { success: false, message: 'Invalid 6-digit verification code. Please check your email.' };
  }

  // Update in MongoDB
  if (clientPromise && customer._id) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      await db.collection('customers').updateOne(
        { email: email.toLowerCase().trim() },
        { $set: { isVerified: true, verificationCode: null } }
      );
    } catch (e) {
      console.warn('[MongoDB] Update customer error:', e);
    }
  }

  customer.isVerified = true;
  customer.verificationCode = undefined;
  return { success: true, message: 'Email verified successfully!', customer };
}
