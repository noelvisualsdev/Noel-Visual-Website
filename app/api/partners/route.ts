import { NextResponse } from 'next/server';

const FORUM_CHANNEL_ID = '1534150793261748254';
const BOT_TOKEN = process.env.DISCORD_BOT_TOKEN;

async function discordFetch(path: string) {
  const res = await fetch(`https://discord.com/api/v10${path}`, {
    headers: {
      Authorization: `Bot ${BOT_TOKEN}`,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 60 }, // Cache 60 seconds
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Discord API error ${res.status}: ${err}`);
  }
  return res.json();
}

function parsePartnerFromThread(thread: any, firstMessage: any) {
  const content: string = firstMessage?.content || '';
  const embeds: any[] = firstMessage?.embeds || [];
  const attachments: any[] = firstMessage?.attachments || [];

  // Try to get logo from attachments or embed thumbnail/image
  let logoUrl = '';
  if (attachments.length > 0) {
    const imgAttachment = attachments.find((a: any) =>
      /\.(png|jpg|jpeg|gif|webp|svg)/i.test(a.filename || a.url || '')
    );
    if (imgAttachment) logoUrl = imgAttachment.url;
  }
  if (!logoUrl && embeds.length > 0) {
    logoUrl =
      embeds[0]?.thumbnail?.url ||
      embeds[0]?.image?.url ||
      embeds[0]?.author?.icon_url ||
      '';
  }

  // Try to extract website URL from content
  const urlMatch = content.match(/https?:\/\/[^\s<>)"]+/);
  const websiteUrl = urlMatch ? urlMatch[0] : '';

  // Description = message content without the URL
  const description = content.replace(/https?:\/\/[^\s<>)"]+/g, '').trim();

  return {
    id: thread.id,
    name: thread.name,
    logoUrl,
    websiteUrl,
    description: description.slice(0, 300),
    category: 'Partner',
    threadId: thread.id,
    createdAt: thread.thread_metadata?.create_timestamp || '',
  };
}

export async function GET() {
  if (!BOT_TOKEN) {
    return NextResponse.json(
      { success: false, message: 'DISCORD_BOT_TOKEN not set' },
      { status: 500 }
    );
  }

  try {
    const partners: any[] = [];
    const seenIds = new Set<string>();

    // 1. Fetch active threads in the forum channel
    try {
      const activeData = await discordFetch(
        `/channels/${FORUM_CHANNEL_ID}/threads/active`
      );
      const activeThreads: any[] = activeData.threads || [];

      for (const thread of activeThreads) {
        if (seenIds.has(thread.id)) continue;
        seenIds.add(thread.id);

        try {
          const messages = await discordFetch(
            `/channels/${thread.id}/messages?limit=1`
          );
          const firstMsg = Array.isArray(messages) ? messages[messages.length - 1] : null;
          partners.push(parsePartnerFromThread(thread, firstMsg));
        } catch {
          partners.push(parsePartnerFromThread(thread, null));
        }
      }
    } catch (e) {
      console.warn('[Partners] Active threads fetch failed:', e);
    }

    // 2. Fetch archived public threads
    try {
      const archivedData = await discordFetch(
        `/channels/${FORUM_CHANNEL_ID}/threads/archived/public?limit=50`
      );
      const archivedThreads: any[] = archivedData.threads || [];

      for (const thread of archivedThreads) {
        if (seenIds.has(thread.id)) continue;
        seenIds.add(thread.id);

        try {
          const messages = await discordFetch(
            `/channels/${thread.id}/messages?limit=1`
          );
          const firstMsg = Array.isArray(messages) ? messages[messages.length - 1] : null;
          partners.push(parsePartnerFromThread(thread, firstMsg));
        } catch {
          partners.push(parsePartnerFromThread(thread, null));
        }
      }
    } catch (e) {
      console.warn('[Partners] Archived threads fetch failed:', e);
    }

    return NextResponse.json({ success: true, data: partners });
  } catch (error: any) {
    console.error('[Partners API Error]:', error.message);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
