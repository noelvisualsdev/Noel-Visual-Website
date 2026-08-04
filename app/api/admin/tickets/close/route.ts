import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { sendViaResendOrFallback } from '@/lib/email-service';


export async function POST(request: Request) {
  try {
    const { ticketId, clientEmail, clientName, projectType } = await request.json();

    if (!ticketId || !clientEmail) {
      return NextResponse.json({ success: false, message: 'Missing ticketId or clientEmail' }, { status: 400 });
    }

    const client = await clientPromise;
    if (!client) throw new Error('MongoDB connection failed');
    const db = client.db('noelvisuals');



    // Update ticket status to "done" in MongoDB
    let updateResult;
    try {
      updateResult = await db.collection('tickets').updateOne(
        { _id: new ObjectId(ticketId) },
        { $set: { status: 'done', completedAt: new Date() } }
      );
    } catch {
      // Fallback: match by string id field
      updateResult = await db.collection('tickets').updateOne(
        { id: ticketId },
        { $set: { status: 'done', completedAt: new Date() } }
      );
    }

    // Send "Order Completed" confirmation email to client
    const subject = `✅ Your Order Has Been Completed – NOEL VISUALS`;
    const html = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="margin:0;padding:0;background:#f4f5f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f4f5f7;padding:40px 15px;">
          <tr><td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width:540px;background:#fff;border-radius:12px;padding:36px 32px;border:1px solid #e5e7eb;box-shadow:0 4px 12px rgba(0,0,0,0.05);">
              <tr><td align="left" style="padding-bottom:24px;">
                <div style="display:inline-block;width:42px;height:42px;background:#000;color:#fff;font-weight:900;font-size:18px;line-height:42px;border-radius:10px;text-align:center;">NV</div>
              </td></tr>
              <tr><td align="left" style="padding-bottom:12px;">
                <h1 style="margin:0;font-size:22px;font-weight:800;color:#111827;">Your order is complete! 🎉</h1>
              </td></tr>
              <tr><td align="left" style="padding-bottom:24px;">
                <p style="margin:0;color:#4b5563;font-size:14px;line-height:1.6;">
                  Hey <strong>${clientName || 'there'}</strong>! Great news — your order for <strong>${projectType || 'your project'}</strong> has been completed and marked as done by our team.
                </p>
              </td></tr>
              <tr><td style="padding-bottom:24px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px;">
                  <tr><td align="center">
                    <div style="font-size:32px;margin-bottom:8px;">✅</div>
                    <div style="font-size:15px;font-weight:800;color:#15803d;">ORDER COMPLETED</div>
                    <div style="font-size:12px;color:#166534;margin-top:4px;">Completed on ${new Date().toLocaleDateString('de-DE')}</div>
                  </td></tr>
                </table>
              </td></tr>
              <tr><td align="left" style="padding-bottom:24px;">
                <p style="margin:0;color:#4b5563;font-size:14px;line-height:1.6;">
                  If you have any questions or need revisions, feel free to reach out to us at any time. We truly appreciate your trust in NOEL VISUALS!
                </p>
              </td></tr>
              <tr><td align="left" style="border-top:1px solid #f3f4f6;padding-top:24px;">
                <p style="margin:0;color:#111827;font-size:14px;font-weight:700;">Thanks,<br/>The Noel Visuals Team</p>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </body>
      </html>
    `;

    await sendViaResendOrFallback(clientEmail, subject, html);

    return NextResponse.json({
      success: true,
      message: `Ticket marked as done. Confirmation email sent to ${clientEmail}.`,
    });
  } catch (error: any) {
    console.error('[Ticket Close Error]:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
