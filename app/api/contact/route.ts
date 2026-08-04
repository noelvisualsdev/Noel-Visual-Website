import { NextResponse } from 'next/server';
import { z } from 'zod';
import { saveBrief } from '@/lib/db';
import { sendNewBriefNotificationToAdmin } from '@/lib/email-service';

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  projectType: z.string().min(1),
  budgetRange: z.string().optional().default('Custom Quote'),
  timeline: z.string().optional().default('Flexible'),
  message: z.string().min(10),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = contactSchema.parse(body);

    // 1. Save brief to MongoDB Atlas tickets collection
    const saved = await saveBrief(validatedData);

    // 2. Dispatch email notification safely (non-blocking)
    try {
      await sendNewBriefNotificationToAdmin({
        name: saved.name,
        email: saved.email,
        projectType: saved.projectType,
        message: saved.message,
        id: saved.id,
      });
    } catch (emailErr) {
      console.warn('[Contact API Email Warning]: Failed to send admin email, but brief was saved to MongoDB:', emailErr);
    }

    return NextResponse.json(
      {
        success: true,
        data: saved,
        message: 'Project brief submitted successfully. Saved to MongoDB tickets.',
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
