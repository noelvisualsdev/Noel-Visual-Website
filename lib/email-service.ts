import nodemailer from 'nodemailer';

export async function sendVerificationEmail(
  toEmail: string,
  username: string,
  verificationCode: string
): Promise<{ success: boolean; message: string }> {
  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const port = Number(process.env.SMTP_PORT) || 587;
  const user = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : '';
  
  const rawPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim() : '';
  const pass = rawPass.includes(' ') ? rawPass.replace(/\s+/g, '') : rawPass;
  const from = process.env.SMTP_FROM || `"NOEL VISUALS" <${user || 'contact.noelvisuals@gmail.com'}>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f5f7; color: #111827; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f5f7; padding: 40px 15px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 540px; background-color: #ffffff; border-radius: 12px; padding: 36px 32px; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              
              <!-- Brand Logo Top Left -->
              <tr>
                <td align="left" style="padding-bottom: 24px;">
                  <div style="display: inline-block; width: 42px; height: 42px; background-color: #000000; color: #ffffff; font-weight: 900; font-size: 18px; line-height: 42px; border-radius: 10px; text-align: center;">
                    NV
                  </div>
                </td>
              </tr>

              <!-- Main Title -->
              <tr>
                <td align="left" style="padding-bottom: 12px;">
                  <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #111827;">
                    Verify your email address
                  </h1>
                </td>
              </tr>

              <!-- Intro Text -->
              <tr>
                <td align="left" style="padding-bottom: 24px;">
                  <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
                    Hey <strong>${username}</strong>! You're almost ready to go. Please use the 6-digit verification code below to complete your account setup:
                  </p>
                </td>
              </tr>

              <!-- Clean Light Gray Code Box -->
              <tr>
                <td style="padding-bottom: 28px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 24px;">
                    <tr>
                      <td align="center">
                        <div style="font-size: 11px; font-family: monospace; text-transform: uppercase; color: #6b7280; letter-spacing: 1px; margin-bottom: 8px;">
                          Verification Code
                        </div>
                        <div style="font-family: 'Courier New', Courier, monospace; font-size: 36px; font-weight: 900; letter-spacing: 10px; color: #111827;">
                          ${verificationCode}
                        </div>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>

              <!-- Footer Signoff -->
              <tr>
                <td align="left" style="border-top: 1px solid #f3f4f6; padding-top: 24px;">
                  <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
                    If you had any trouble registering or have questions, feel free to reply to this email.
                  </p>
                  <p style="margin: 16px 0 0 0; color: #111827; font-size: 14px; font-weight: 700;">
                    Thanks,<br/>The Noel Visuals Team
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  if (user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 8000,
        tls: {
          rejectUnauthorized: false,
        },
      });

      const info = await transporter.sendMail({
        from,
        to: toEmail,
        subject: `${verificationCode} is your NOEL VISUALS Verification Code`,
        text: `Your NOEL VISUALS verification code is: ${verificationCode}`,
        html: htmlContent,
      });

      console.log(`[SMTP Email Success] Verification code sent to ${toEmail}: ${info.messageId}`);
      return { success: true, message: `Verification code sent to ${toEmail}` };
    } catch (err: any) {
      console.error('[SMTP Email Error]:', err);
      return { success: false, message: `SMTP Error: ${err.message}` };
    }
  }

  return {
    success: true,
    message: `Code generated for ${toEmail}. Add SMTP_USER and SMTP_PASS in .env.local to send live emails.`,
  };
}

export async function sendNewBriefNotificationToAdmin(briefData: {
  name: string;
  email: string;
  projectType: string;
  message: string;
  id?: string;
}): Promise<{ success: boolean; message: string }> {
  const host = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  let port = Number(process.env.SMTP_PORT) || 465;
  const user = process.env.SMTP_USER ? process.env.SMTP_USER.trim() : '';
  
  const rawPass = process.env.SMTP_PASS ? process.env.SMTP_PASS.trim() : '';
  const pass = rawPass.includes(' ') ? rawPass.replace(/\s+/g, '') : rawPass;

  const targetAdminEmail = 'contact.noelvisuals@gmail.com';
  const from = process.env.SMTP_FROM || `"NOEL VISUALS ORDERS" <${user || 'contact.noelvisuals@gmail.com'}>`;

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #f4f5f7; color: #111827; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f4f5f7; padding: 40px 15px;">
        <tr>
          <td align="center">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 560px; background-color: #ffffff; border-radius: 12px; padding: 36px 32px; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
              
              <!-- Brand Logo Top Left -->
              <tr>
                <td align="left" style="padding-bottom: 24px;">
                  <div style="display: inline-block; width: 42px; height: 42px; background-color: #000000; color: #ffffff; font-weight: 900; font-size: 18px; line-height: 42px; border-radius: 10px; text-align: center;">
                    NV
                  </div>
                </td>
              </tr>

              <!-- Main Title -->
              <tr>
                <td align="left" style="padding-bottom: 12px;">
                  <h1 style="margin: 0; font-size: 22px; font-weight: 800; color: #111827;">
                    New order inquiry received
                  </h1>
                </td>
              </tr>

              <!-- Subtitle Description -->
              <tr>
                <td align="left" style="padding-bottom: 24px;">
                  <p style="margin: 0; color: #4b5563; font-size: 14px; line-height: 1.6;">
                    A client has submitted a new project brief through the website. Here are the full project details:
                  </p>
                </td>
              </tr>

              <!-- Light Gray Order Card -->
              <tr>
                <td style="padding-bottom: 24px;">
                  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 24px;">
                    
                    <tr>
                      <td style="padding-bottom: 16px; border-bottom: 1px solid #e5e7eb;">
                        <div style="font-size: 11px; font-weight: 700; font-family: monospace; text-transform: uppercase; color: #6b7280; margin-bottom: 4px;">
                          Order Category (${briefData.id || 'NEW TICKET'})
                        </div>
                        <div style="font-size: 16px; font-weight: 800; color: #111827;">
                          ${briefData.projectType}
                        </div>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding-top: 16px;">
                        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 13px;">
                          <tr>
                            <td style="padding: 6px 0; color: #6b7280; width: 120px; font-weight: 600;">Client Name:</td>
                            <td style="padding: 6px 0; color: #111827; font-weight: 700;">${briefData.name}</td>
                          </tr>
                          <tr>
                            <td style="padding: 6px 0; color: #6b7280; font-weight: 600;">Client Email:</td>
                            <td style="padding: 6px 0;">
                              <a href="mailto:${briefData.email}" style="color: #4f46e5; text-decoration: underline; font-weight: 700;">${briefData.email}</a>
                            </td>
                          </tr>
                          <tr>
                            <td style="padding: 6px 0; color: #6b7280; font-weight: 600;">Timestamp:</td>
                            <td style="padding: 6px 0; color: #374151;">${new Date().toLocaleString('de-DE')}</td>
                          </tr>
                        </table>
                      </td>
                    </tr>

                    <tr>
                      <td style="padding-top: 16px; border-top: 1px solid #e5e7eb; margin-top: 16px;">
                        <div style="font-size: 11px; font-weight: 700; font-family: monospace; text-transform: uppercase; color: #6b7280; margin-bottom: 6px;">
                          Project Brief & Details:
                        </div>
                        <div style="color: #1f2937; font-size: 14px; line-height: 1.6; white-space: pre-wrap; font-style: italic;">
                          "${briefData.message}"
                        </div>
                      </td>
                    </tr>

                  </table>
                </td>
              </tr>

              <!-- Primary Action Button -->
              <tr>
                <td align="left" style="padding-bottom: 28px;">
                  <a href="mailto:${briefData.email}?subject=RE:%20${encodeURIComponent(briefData.projectType)}%20Inquiry%20-%20NOEL%20VISUALS" 
                     style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-weight: 700; font-size: 14px; padding: 12px 28px; border-radius: 8px; text-decoration: none; box-shadow: 0 4px 10px rgba(79, 70, 229, 0.25);">
                    Reply to client
                  </a>
                </td>
              </tr>

              <!-- Footer Signoff -->
              <tr>
                <td align="left" style="border-top: 1px solid #f3f4f6; padding-top: 24px;">
                  <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.6;">
                    If you have any questions regarding this order inquiry, feel free to reply directly to this email.
                  </p>
                  <p style="margin: 16px 0 0 0; color: #111827; font-size: 14px; font-weight: 700;">
                    Thanks,<br/>The Noel Visuals Team
                  </p>
                </td>
              </tr>

            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
  `;

  if (user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        host,
        port,
        secure: port === 465,
        auth: { user, pass },
        connectionTimeout: 8000,
        greetingTimeout: 8000,
        socketTimeout: 8000,
        tls: {
          rejectUnauthorized: false,
        },
      });

      const info = await transporter.sendMail({
        from,
        to: targetAdminEmail,
        replyTo: briefData.email,
        subject: `🚨 NEW ORDER BRIEF: [${briefData.projectType}] from ${briefData.name}`,
        text: `New order brief from ${briefData.name} (${briefData.email})\nCategory: ${briefData.projectType}\nMessage:\n${briefData.message}`,
        html: htmlContent,
      });

      console.log(`[Admin Order Email Notification] Sent to ${targetAdminEmail}: ${info.messageId}`);
      return { success: true, message: `Notification sent to ${targetAdminEmail}` };
    } catch (err: any) {
      console.error('[Admin Email Error]:', err);
      return { success: false, message: `SMTP Error: ${err.message}` };
    }
  }

  return { success: true, message: 'Admin email logged (console).' };
}
