import React from 'react';
import { getBriefs } from '@/lib/db';
import BriefsClient from './BriefsClient';

export const dynamic = 'force-dynamic';

export default async function AdminBriefsPage() {
  const briefs = await getBriefs();
  return <BriefsClient initialBriefs={briefs as any} />;
}
