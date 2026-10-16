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

    // 1. Email Template for Provider
    const providerSubject = `🔔 Work Order: ${residentName} called you for ${serviceCategory} (${residentLocation})`;
    const providerHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
        <div style="background: linear-gradient(135deg, #059669 0%, #10b981 100%); padding: 20px; border-radius: 8px; text-align: center; color: white;">
          <h1 style="margin: 0; font-size: 22px;">NearNest Community Dispatch</h1>
          <p style="margin: 5px 0 0 0; font-size: 14px; opacity: 0.9;">New Work Order Received</p>
        </div>

        <div style="padding: 24px 0;">
          <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Resident Called You For Work!</h2>
          <p style="color: #334155; font-size: 15px; line-height: 1.6;">
            Hello <strong>${providerName}</strong>, resident <strong>${residentName}</strong> has hired you on NearNest for <strong>${serviceCategory}</strong>. Please review their address and task below:
          </p>

          <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <h3 style="margin-top: 0; font-size: 13px; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Work Order & Resident Details</h3>
            <table style="width: 100%; font-size: 14px; color: #1e293b; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; width: 140px;">Resident Name:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #0f172a;">${residentName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Job / Flat Address:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #059669;">${residentLocation}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Service Requested:</td>
                <td style="padding: 8px 0; font-weight: bold;">${serviceCategory}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Resident Phone:</td>
                <td style="padding: 8px 0; font-weight: bold; color: #0284c7;">${residentPhone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b;">Resident Email:</td>
                <td style="padding: 8px 0;">${residentEmail || 'Shared in Portal'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; vertical-align: top;">Work Description:</td>
                <td style="padding: 8px 0; font-weight: 500; color: #0f172a; background: #fff; padding: 10px; border-radius: 6px; border: 1px solid #e2e8f0;">"${serviceNotes}"</td>
              </tr>
            </table>
          </div>

          <div style="text-align: center; margin: 24px 0 10px 0;">
            <a href="tel:${residentPhone.replace(/[^0-9+]/g, '')}" style="display: inline-block; background-color: #059669; color: #ffffff; padding: 12px 28px; border-radius: 8px; font-weight: bold; text-decoration: none; font-size: 14px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              📞 Call Resident Directly (${residentPhone})
            </a>
          </div>
        </div>

        <div style="border-top: 1px solid #e2e8f0; padding-top: 16px; font-size: 12px; color: #94a3b8; text-align: center;">
          © NearNest Platform • Automated Service Dispatch
        </div>
      </div>
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
