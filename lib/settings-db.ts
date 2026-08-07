import clientPromise from './mongodb';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const settingsPath = path.join(dataDir, 'settings.json');

function ensureSettingsFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify({ maintenanceMode: false }, null, 2), 'utf-8');
  }
}

export async function getMaintenanceMode(): Promise<boolean> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const doc = await db.collection('settings').findOne({ key: 'general' });
      if (doc && typeof doc.maintenanceMode === 'boolean') {
        return doc.maintenanceMode;
      }
    } catch (e) {
      console.warn('[MongoDB] Settings query fallback:', e);
    }
  }

  ensureSettingsFile();
  try {
    const data = fs.readFileSync(settingsPath, 'utf-8');
    const parsed = JSON.parse(data);
    return Boolean(parsed.maintenanceMode);
  } catch (err) {
    return false;
  }
}

export async function setMaintenanceMode(enabled: boolean): Promise<boolean> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      await db.collection('settings').updateOne(
        { key: 'general' },
        { $set: { key: 'general', maintenanceMode: enabled, updatedAt: new Date() } },
        { upsert: true }
      );
    } catch (e) {
      console.warn('[MongoDB] Settings update fallback:', e);
    }
  }

  ensureSettingsFile();
  try {
    const data = fs.readFileSync(settingsPath, 'utf-8');
    const parsed = JSON.parse(data);
    parsed.maintenanceMode = enabled;
    fs.writeFileSync(settingsPath, JSON.stringify(parsed, null, 2), 'utf-8');
    return true;
  } catch (err) {
    return false;
  }
}
