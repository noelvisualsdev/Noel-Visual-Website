import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { saveExternalMediaLocally } from '@/lib/upload-helper';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (!clientPromise) {
    return NextResponse.json({ success: false, message: 'No MongoDB connection' }, { status: 500 });
  }

  try {
    const client = await clientPromise;
    const db = client.db('noelvisuals');
    const projects = await db.collection('projects').find({}).toArray();

    let updatedCount = 0;

    for (const proj of projects) {
      let changed = false;
      let newImages: string[] = [];

      const rawImages: string[] = Array.isArray(proj.images)
        ? proj.images
        : (typeof proj.images === 'string' && proj.images ? [proj.images] : (proj.image ? [proj.image] : []));

      for (const imgUrl of rawImages) {
        if (imgUrl && imgUrl.startsWith('http')) {
          const localPath = await saveExternalMediaLocally(imgUrl);
          if (localPath && localPath !== imgUrl) {
            newImages.push(localPath);
            changed = true;
          } else {
            newImages.push(imgUrl);
          }
        } else {
          newImages.push(imgUrl);
        }
      }

      let newVideoUrl = proj.videoUrl;
      if (proj.videoUrl && proj.videoUrl.startsWith('http')) {
        const localVideo = await saveExternalMediaLocally(proj.videoUrl);
        if (localVideo && localVideo !== proj.videoUrl) {
          newVideoUrl = localVideo;
          changed = true;
        }
      }

      if (changed) {
        await db.collection('projects').updateOne(
          { _id: proj._id },
          {
            $set: {
              images: newImages,
              image: newImages[0] || proj.image,
              videoUrl: newVideoUrl,
              updatedAt: new Date(),
            },
          }
        );
        updatedCount++;
      }
    }

    return NextResponse.json({
      success: true,
      message: `Migration completed! ${updatedCount} projects updated with permanent local media.`,
      totalProjects: projects.length,
      updatedCount,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
