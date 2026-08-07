import clientPromise from './mongodb';
import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const settingsPath = path.join(dataDir, 'settings.json');

export interface GeneralSettings {
  maintenanceMode: boolean;
  announcementText: string;
  announcementEnabled: boolean;
  showStaffBanner: boolean;
}

const DEFAULT_SETTINGS: GeneralSettings = {
  maintenanceMode: false,
  announcementText: '🎉 20% SALE AUF ALLE EDITING PAKETE! JETZT PROJEKT ANFRAGEN',
  announcementEnabled: true,
  showStaffBanner: false,
};

function ensureSettingsFile() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(settingsPath)) {
    fs.writeFileSync(settingsPath, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
  }
}

export async function getGeneralSettings(): Promise<GeneralSettings> {
  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      const doc = await db.collection('settings').findOne({ key: 'general' });
      if (doc) {
        return {
          maintenanceMode: typeof doc.maintenanceMode === 'boolean' ? doc.maintenanceMode : DEFAULT_SETTINGS.maintenanceMode,
          announcementText: typeof doc.announcementText === 'string' ? doc.announcementText : DEFAULT_SETTINGS.announcementText,
          announcementEnabled: typeof doc.announcementEnabled === 'boolean' ? doc.announcementEnabled : DEFAULT_SETTINGS.announcementEnabled,
          showStaffBanner: typeof doc.showStaffBanner === 'boolean' ? doc.showStaffBanner : DEFAULT_SETTINGS.showStaffBanner,
        };
      }
    } catch (e) {
      console.warn('[MongoDB] Settings query fallback:', e);
    }
  }

  ensureSettingsFile();
  try {
    const data = fs.readFileSync(settingsPath, 'utf-8');
    const parsed = JSON.parse(data);
    return {
      maintenanceMode: Boolean(parsed.maintenanceMode),
      announcementText: parsed.announcementText || DEFAULT_SETTINGS.announcementText,
      announcementEnabled: typeof parsed.announcementEnabled === 'boolean' ? parsed.announcementEnabled : DEFAULT_SETTINGS.announcementEnabled,
      showStaffBanner: typeof parsed.showStaffBanner === 'boolean' ? parsed.showStaffBanner : DEFAULT_SETTINGS.showStaffBanner,
    };
  } catch (err) {
    return DEFAULT_SETTINGS;
  }
}

export async function updateGeneralSettings(partial: Partial<GeneralSettings>): Promise<GeneralSettings> {
  const current = await getGeneralSettings();
  const updated: GeneralSettings = { ...current, ...partial };

  if (clientPromise) {
    try {
      const client = await clientPromise;
      const db = client.db('noelvisuals');
      await db.collection('settings').updateOne(
        { key: 'general' },
        { $set: { key: 'general', ...updated, updatedAt: new Date() } },
        { upsert: true }
      );
    } catch (e) {
      console.warn('[MongoDB] Settings update fallback:', e);
    }
  }

  ensureSettingsFile();
  try {
    fs.writeFileSync(settingsPath, JSON.stringify(updated, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error writing settings.json:', err);
  }

  return updated;
}

export async function getMaintenanceMode(): Promise<boolean> {
  const settings = await getGeneralSettings();
  return settings.maintenanceMode;
}

export async function setMaintenanceMode(enabled: boolean): Promise<boolean> {
  const updated = await updateGeneralSettings({ maintenanceMode: enabled });
  return updated.maintenanceMode;
}
