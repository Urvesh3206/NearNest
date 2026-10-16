import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { providerEmail, residentDetails } = body;

    const targetEmail = providerEmail?.trim();
    if (!targetEmail || !targetEmail.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid or missing provider email address.' },
        { status: 400 }
      );
    }

    const residentName = residentDetails?.name || 'Resident Member';
    const residentEmail = residentDetails?.email?.trim();
    const residentLocation =
      residentDetails?.location ||
      residentDetails?.society ||
      residentDetails?.unit ||
      residentDetails?.address ||
      'Greenfield Residency';
    const serviceCategory =
      residentDetails?.serviceCategory ||
      residentDetails?.category ||
      'Home Maintenance';
    const residentPhone = residentDetails?.phone || 'Available in NearNest';
    const providerName = residentDetails?.providerName || 'Service Provider';
    const serviceNotes =
      residentDetails?.serviceRequired ||
      residentDetails?.notes ||
      'Doorstep society service request';

    const cleanPhone = residentPhone.replace(/[^0-9+]/g, '');
    const waPhone = cleanPhone.replace(/^\+/, '');
    const bookingRef = `NN-${Date.now().toString().slice(-6)}`;
    const formattedDate = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

    // 1. Email Template for Provider
    const providerSubject = `🔔 Work Order: ${residentName} called you for ${serviceCategory} (${residentLocation})`;
    const providerHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Work Order Dispatch - NearNest</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f8fafc; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; -webkit-font-smoothing: antialiased; color: #1e293b;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background-color: #f8fafc; padding: 24px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 16px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);">
          <!-- Header Banner -->
          <tr>
            <td style="background: linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%); padding: 32px 28px; text-align: left;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td>
                    <span style="display: inline-block; background-color: rgba(255, 255, 255, 0.2); color: #ffffff; font-size: 11px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 10px; border-radius: 9999px; margin-bottom: 12px;">
                      ⚡ Real-Time Work Order Dispatch
                    </span>
                    <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 800; line-height: 1.25;">
                      New Job Request Received!
                    </h1>
                    <p style="margin: 6px 0 0 0; color: #d1fae5; font-size: 14px;">
                      NearNest Community Service Dispatch • ${serviceCategory}
                    </p>
                  </td>
                  <td align="right" valign="top" style="width: 50px;">
                    <div style="background-color: #ffffff; width: 44px; height: 44px; border-radius: 12px; text-align: center; line-height: 44px; font-size: 22px; box-shadow: 0 2px 6px rgba(0,0,0,0.1);">
                      🛠️
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Intro -->
          <tr>
            <td style="padding: 28px 28px 20px 28px;">
              <p style="margin: 0; font-size: 16px; line-height: 1.6; color: #334155;">
                Hello <strong>${providerName}</strong>,
              </p>
              <p style="margin: 8px 0 0 0; font-size: 15px; line-height: 1.6; color: #475569;">
                Resident <strong>${residentName}</strong> has selected and hired you for <strong>${serviceCategory}</strong> in their housing society. Please review the resident's task and address below:
              </p>
            </td>
          </tr>

          <!-- Work Order Info Table -->
          <tr>
            <td style="padding: 0 28px 20px 28px;">
              <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 20px;">
                <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="font-size: 14px;">
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; width: 140px; font-weight: 500;">Booking Ref:</td>
                    <td style="padding: 6px 0; font-weight: 700; color: #059669; font-family: monospace;">${bookingRef}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Resident Name:</td>
                    <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">${residentName}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Service Required:</td>
                    <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">
                      <span style="background-color: #ecfdf5; color: #047857; padding: 2px 8px; border-radius: 6px; border: 1px solid #a7f3d0; font-size: 12px;">
                        ${serviceCategory}
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Job Location:</td>
                    <td style="padding: 6px 0; font-weight: 700; color: #0f172a;">📍 ${residentLocation}</td>
                  </tr>
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Resident Phone:</td>
                    <td style="padding: 6px 0; font-weight: 700; color: #0284c7;">📞 ${residentPhone}</td>
                  </tr>
                  ${residentEmail ? `
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Resident Email:</td>
                    <td style="padding: 6px 0; color: #334155;">✉️ ${residentEmail}</td>
                  </tr>` : ''}
                  <tr>
                    <td style="padding: 6px 0; color: #64748b; font-weight: 500;">Dispatched At:</td>
                    <td style="padding: 6px 0; color: #64748b; font-size: 13px;">${formattedDate}</td>
                  </tr>
                </table>
              </div>
            </td>
          </tr>

          <!-- Task Quote -->
          <tr>
            <td style="padding: 0 28px 24px 28px;">
              <div style="background-color: #ffffff; border-left: 4px solid #059669; border-top: 1px solid #e2e8f0; border-right: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; border-radius: 8px; padding: 16px 18px;">
                <p style="margin: 0 0 6px 0; font-size: 12px; font-weight: 700; text-transform: uppercase; color: #059669; letter-spacing: 0.05em;">
                  Resident's Task Instructions:
                </p>
                <p style="margin: 0; font-size: 15px; font-style: italic; color: #1e293b; line-height: 1.6;">
                  "${serviceNotes}"
                </p>
              </div>
            </td>
          </tr>

          <!-- Action Buttons -->
          <tr>
            <td style="padding: 0 28px 28px 28px;">
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom: 12px;">
                    <a href="tel:${cleanPhone}" style="display: inline-block; width: 85%; max-width: 380px; background-color: #059669; color: #ffffff; text-align: center; padding: 14px 20px; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 15px; box-shadow: 0 4px 10px rgba(5, 150, 105, 0.25);">
                      📞 Call Resident Directly (${residentPhone})
                    </a>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <a href="https://wa.me/${waPhone}?text=Hello%20${encodeURIComponent(residentName)}%2C%20I%20received%20your%20service%20request%20on%20NearNest%20for%20${encodeURIComponent(serviceCategory)}." target="_blank" style="display: inline-block; width: 85%; max-width: 380px; background-color: #25D366; color: #ffffff; text-align: center; padding: 12px 20px; border-radius: 10px; font-weight: 700; text-decoration: none; font-size: 14px; box-shadow: 0 2px 6px rgba(37, 211, 102, 0.25);">
                      💬 Message on WhatsApp
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Checklist -->
          <tr>
            <td style="padding: 0 28px 28px 28px;">
              <div style="background-color: #f1f5f9; border-radius: 10px; padding: 14px 18px; font-size: 13px; color: #475569; line-height: 1.6;">
                <strong style="color: #0f172a;">Quick Pro Checklist:</strong>
                <ul style="margin: 6px 0 0 0; padding-left: 20px;">
                  <li>Call or WhatsApp the resident to confirm visit timing.</li>
                  <li>Carry your government ID or NearNest Verified profile badge for gate entry.</li>
                  <li>Update the job status to <strong>Accepted</strong> in your NearNest Service Dashboard.</li>
                </ul>
              </div>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #0f172a; padding: 24px 28px; text-align: center; color: #94a3b8; font-size: 12px; line-height: 1.6;">
              <p style="margin: 0 0 6px 0; color: #ffffff; font-weight: 700; font-size: 14px;">
                NearNest • Connected &amp; Thriving Communities
              </p>
              <p style="margin: 0 0 12px 0;">
                Automated Work Order Dispatch Notification System
              </p>
              <div style="border-top: 1px solid #1e293b; padding-top: 12px; margin-top: 12px; color: #64748b; font-size: 11px;">
                You are receiving this notification because you are a registered service provider on NearNest.
              </div>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    // 2. Email Template for Resident (Booking Confirmation)
    const residentSubject = `Booking Confirmation: Your request for ${providerName} has been received!`;
    const residentHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 20px; border-radius: 8px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 22px;">NearNest Resident Portal</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">Service Booking Confirmation</p>
        </div>

        <div style="padding: 24px 0;">
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Hi ${residentName},</h2>
          <p style="color: #334155; font-size: 15px; line-height: 1.6;">
            Your request for <strong>${providerName}</strong> (${serviceCategory}) has been successfully submitted!
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <h3 style="margin-top: 0; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Booking Summary</h3>
            <table style="width: 100%; font-size: 14px; color: #1e293b; border-collapse: collapse;">
              <tr>
                <td style="padding: 6px 0; color: #64748b; width: 140px;">Technician / Pro:</td>
                <td style="padding: 6px 0; font-weight: bold; color: #059669;">${providerName} (${serviceCategory})</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Your Location:</td>
                <td style="padding: 6px 0; font-weight: bold;">${residentLocation}</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b; vertical-align: top;">Task Description:</td>
                <td style="padding: 6px 0; font-weight: 500; color: #0f172a;">"${serviceNotes}"</td>
              </tr>
              <tr>
                <td style="padding: 6px 0; color: #64748b;">Current Status:</td>
                <td style="padding: 6px 0;"><span style="background: #fef3c7; color: #92400e; padding: 2px 8px; border-radius: 4px; font-weight: bold; font-size: 12px;">PENDING PROVIDER ACCEPTANCE</span></td>
              </tr>
            </table>
          </div>

          <p style="color: #475569; font-size: 14px; line-height: 1.5;">
            The service provider has received your task details and will contact you directly to confirm their arrival time.
          </p>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #94a3b8; text-align: center;">
          © NearNest Platform • Need help? Log in to your Resident Dashboard anytime.
        </div>
      </div>
    `;

    // Priority 1: SMTP / Gmail credentials (Can send to ANY recipient in the world without domain restrictions)
    const rawUser = process.env.EMAIL_USER || process.env.SMTP_USER;
    const rawPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
    const smtpHost = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
    const smtpPort = Number(process.env.SMTP_PORT) || 465;

    const smtpUser = rawUser ? rawUser.replace(/["']/g, '').trim() : '';
    // Strip spaces (e.g. Google 16-character app passwords formatted as "abcd efgh ijkl mnop")
    const smtpPass = rawPass ? rawPass.replace(/["']/g, '').trim().replace(/\s+/g, '') : '';

    if (smtpUser && smtpPass) {
      try {
        const isGmail = smtpHost.includes('gmail') || smtpUser.endsWith('@gmail.com');
        const transporter = nodemailer.createTransport({
          service: isGmail ? 'gmail' : undefined,
          host: isGmail ? undefined : smtpHost,
          port: isGmail ? undefined : smtpPort,
          secure: isGmail ? true : smtpPort === 465,
          auth: { user: smtpUser, pass: smtpPass },
          tls: { rejectUnauthorized: false }, // Avoid Windows SSL certificate inspection issues in dev
        });

        const senderAddress = isGmail
          ? `"NearNest Notifications" <${smtpUser}>`
          : (process.env.SMTP_FROM || `"NearNest Notifications" <${smtpUser}>`);

        // Send to Provider
        const provRes = await transporter.sendMail({
          from: senderAddress,
          to: targetEmail,
          subject: providerSubject,
          html: providerHtml,
        });

        // Send to Resident
        let residentDelivered = false;
        if (residentEmail && residentEmail.includes('@')) {
          await transporter.sendMail({
            from: senderAddress,
            to: residentEmail,
            subject: residentSubject,
            html: residentHtml,
          });
          residentDelivered = true;
        }

        console.log(`[NearNest SMTP Real Email]: Successfully delivered to ${targetEmail} and ${residentEmail}! MessageId: ${provRes.messageId}`);

        return NextResponse.json({
          success: true,
          method: 'smtp',
          isRealDelivery: true,
          message: `Real email successfully dispatched directly to ${targetEmail}!`,
          deliveredTo: { provider: targetEmail, resident: residentEmail },
        });
      } catch (smtpErr: any) {
        console.error('SMTP Delivery error, falling back to Resend/Ethereal:', smtpErr);
      }
    }

    // Priority 2: Resend API (Real Email Delivery)
    const resendApiKey = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY;
    if (resendApiKey) {
      try {
        const fromEmail = process.env.RESEND_FROM_EMAIL || 'NearNest Job Alerts <onboarding@resend.dev>';
        let provSuccess = false;
        let resSuccess = false;

        // 1. Send to Provider
        const provRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: fromEmail, to: [targetEmail], subject: providerSubject, html: providerHtml }),
        });
        const provData = await provRes.json();
        if (provRes.ok) {
          provSuccess = true;
          console.log(`[Resend]: Job alert sent to provider ${targetEmail}! Message ID: ${provData.id}`);
        } else {
          console.warn(`[Resend]: Could not send directly to ${targetEmail}:`, provData);
          // If Resend sandbox allows sending to owner (urveshrane3206@gmail.com), deliver copy to owner
          if (targetEmail !== 'urveshrane3206@gmail.com') {
            const ownerRes = await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
              body: JSON.stringify({
                from: fromEmail,
                to: ['urveshrane3206@gmail.com'],
                subject: `[Provider Job Alert for ${providerName}] ${providerSubject}`,
                html: providerHtml,
              }),
            });
            if (ownerRes.ok) {
              provSuccess = true;
              console.log(`[Resend]: Delivered job alert to account owner urveshrane3206@gmail.com!`);
            }
          }
        }

        // 2. Send to Resident
        if (residentEmail && residentEmail.includes('@')) {
          const resRes = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ from: fromEmail, to: [residentEmail], subject: residentSubject, html: residentHtml }),
          });
          const resData = await resRes.json();
          if (resRes.ok) {
            resSuccess = true;
            console.log(`[Resend]: Confirmation sent to resident ${residentEmail}! Message ID: ${resData.id}`);
          } else {
            console.warn(`[Resend]: Could not send to resident ${residentEmail}:`, resData);
            if (residentEmail !== 'urveshrane3206@gmail.com') {
              const resOwner = await fetch('https://api.resend.com/emails', {
                method: 'POST',
                headers: { Authorization: `Bearer ${resendApiKey}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  from: fromEmail,
                  to: ['urveshrane3206@gmail.com'],
                  subject: `[Resident Confirmation for ${residentName}] ${residentSubject}`,
                  html: residentHtml,
                }),
              });
              if (resOwner.ok) resSuccess = true;
            }
          }
        }

        if (provSuccess || resSuccess) {
          const directProvDelivery = provRes.ok;
          return NextResponse.json({
            success: true,
            method: 'resend',
            isRealDelivery: true,
            directDelivery: directProvDelivery,
            message: directProvDelivery
              ? `Real email dispatched directly to ${targetEmail}!`
              : `Resend sandbox restriction: Resend free tier only sends to account owner (urveshrane3206@gmail.com). Forwarded copy to urveshrane3206@gmail.com!`,
            deliveredTo: {
              provider: directProvDelivery ? targetEmail : 'urveshrane3206@gmail.com (Resend Sandbox Copy)',
              resident: residentEmail,
            },
            sandboxWarning: !directProvDelivery
              ? `To deliver directly to ${targetEmail}'s inbox without Resend domain restrictions, configure Gmail App Password in Email Setup.`
              : null,
          });
        }
      } catch (resendErr) {
        console.warn('Resend failed, falling back:', resendErr);
      }
    }

    // Priority 3: Nodemailer Ethereal test inbox sandbox (Fallback when no SMTP credentials configured)
    // Generates a test delivery preview URL!
    const testAccount = await nodemailer.createTestAccount();
    const testTransporter = nodemailer.createTransport({
      host: testAccount.smtp.host,
      port: testAccount.smtp.port,
      secure: testAccount.smtp.secure,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });

    // 1) Send email to Resident
    let residentPreviewUrl: string | false = false;
    if (residentEmail && residentEmail.includes('@')) {
      const resInfo = await testTransporter.sendMail({
        from: '"NearNest Resident Support" <notifications@nearnest.com>',
        to: residentEmail,
        subject: residentSubject,
        html: residentHtml,
      });
      residentPreviewUrl = nodemailer.getTestMessageUrl(resInfo);
      console.log(`[NearNest Resident Email (Test Sandbox)]: Real preview generated for ${residentEmail}! Preview: ${residentPreviewUrl}`);
    }

    // 2) Send email to Provider
    const provInfo = await testTransporter.sendMail({
      from: '"NearNest Dispatch" <notifications@nearnest.com>',
      to: targetEmail,
      subject: providerSubject,
      html: providerHtml,
    });
    const providerPreviewUrl = nodemailer.getTestMessageUrl(provInfo);
    console.log(`[NearNest Provider Email (Test Sandbox)]: Real preview generated for ${targetEmail}! Preview: ${providerPreviewUrl}`);

    const activePreviewUrl = residentPreviewUrl || providerPreviewUrl;

    return NextResponse.json({
      success: true,
      method: 'ethereal',
      isRealDelivery: false,
      message: 'Request submitted! In test mode, view the generated email preview.',
      previewUrl: activePreviewUrl,
      residentPreviewUrl,
      providerPreviewUrl,
    });
  } catch (err: any) {
    console.error('Error in /api/services/hire:', err);
    return NextResponse.json(
      { success: false, error: err?.message || 'Email delivery failed' },
      { status: 500 }
    );
  }
}
