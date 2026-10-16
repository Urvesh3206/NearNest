import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET() {
  const rawUser = process.env.EMAIL_USER || process.env.SMTP_USER;
  const rawPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
  const smtpHost = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
  const smtpPort = Number(process.env.SMTP_PORT) || 465;

  const smtpUser = rawUser ? rawUser.replace(/["']/g, '').trim() : '';
  const smtpPass = rawPass ? rawPass.replace(/["']/g, '').trim().replace(/\s+/g, '') : '';
  const resendApiKey = process.env.RESEND_API_KEY || process.env.NEXT_PUBLIC_RESEND_API_KEY;

  if (resendApiKey) {
    return NextResponse.json({
      success: true,
      mode: 'resend',
      isConfigured: true,
      info: 'Resend API is configured for production email delivery.',
    });
  }

  if (!smtpUser || !smtpPass) {
    return NextResponse.json({
      success: true,
      mode: 'ethereal',
      isConfigured: false,
      message: 'Real SMTP credentials not found in apps/web/.env.local. Emails currently route through Ethereal Test Sandbox.',
      instructions: {
        step1: 'Open apps/web/.env.local',
        step2: 'Add EMAIL_USER=your_email@gmail.com',
        step3: 'Add EMAIL_PASS=your_16_digit_app_password (generate at myaccount.google.com/apppasswords)',
      },
    });
  }

  try {
    const isGmail = smtpHost.includes('gmail') || smtpUser.endsWith('@gmail.com');
    const transporter = nodemailer.createTransport({
      service: isGmail ? 'gmail' : undefined,
      host: isGmail ? undefined : smtpHost,
      port: isGmail ? undefined : smtpPort,
      secure: isGmail ? true : smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: false },
    });

    await transporter.verify();

    return NextResponse.json({
      success: true,
      mode: 'smtp',
      isConfigured: true,
      emailUser: smtpUser,
      verified: true,
      message: `Connected to SMTP server successfully! Ready to deliver real emails from ${smtpUser}`,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      mode: 'smtp',
      isConfigured: true,
      emailUser: smtpUser,
      verified: false,
      error: err?.message || 'SMTP Authentication Failed',
      tip: 'If using Gmail, ensure you are using a 16-character App Password (not your regular account password) from myaccount.google.com/apppasswords',
    });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to } = body;
    const recipient = to?.trim() || 'sumit.gurjar@adypu.edu.in';

    const rawUser = process.env.EMAIL_USER || process.env.SMTP_USER;
    const rawPass = process.env.EMAIL_PASS || process.env.SMTP_PASS;
    const smtpHost = (process.env.SMTP_HOST || 'smtp.gmail.com').trim();
    const smtpPort = Number(process.env.SMTP_PORT) || 465;

    const smtpUser = rawUser ? rawUser.replace(/["']/g, '').trim() : '';
    const smtpPass = rawPass ? rawPass.replace(/["']/g, '').trim().replace(/\s+/g, '') : '';

    if (!smtpUser || !smtpPass) {
      return NextResponse.json({
        success: false,
        error: 'No SMTP credentials configured. Please add EMAIL_USER and EMAIL_PASS to apps/web/.env.local first.',
      }, { status: 400 });
    }

    const isGmail = smtpHost.includes('gmail') || smtpUser.endsWith('@gmail.com');
    const transporter = nodemailer.createTransport({
      service: isGmail ? 'gmail' : undefined,
      host: isGmail ? undefined : smtpHost,
      port: isGmail ? undefined : smtpPort,
      secure: isGmail ? true : smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: false },
    });

    const info = await transporter.sendMail({
      from: `"NearNest Verification" <${smtpUser}>`,
      to: recipient,
      subject: '✅ NearNest Real Email Delivery Verification',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
          <h2 style="color: #059669; margin-top: 0;">🎉 NearNest Real Email System Is Working!</h2>
          <p style="color: #334155; font-size: 14px; line-height: 1.6;">
            This email confirms that your SMTP configuration is active and delivering directly to your real inbox: <strong>${recipient}</strong>.
          </p>
          <div style="background-color: #f8fafc; padding: 14px; border-radius: 8px; font-size: 13px; color: #475569;">
            <strong>Sender:</strong> ${smtpUser}<br/>
            <strong>Delivered At:</strong> ${new Date().toLocaleString()}<br/>
            <strong>Platform:</strong> NearNest Community Portal
          </div>
        </div>
      `,
    });

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
      deliveredTo: recipient,
      message: `Test email successfully sent to ${recipient}!`,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'Failed to send test email',
    }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const emailUser = body.emailUser?.trim();
    const emailPass = body.emailPass?.trim().replace(/\s+/g, '');
    const testRecipient = body.testRecipient?.trim() || emailUser;

    if (!emailUser || !emailPass) {
      return NextResponse.json({
        success: false,
        error: 'Both Gmail address and 16-character App Password are required.',
      }, { status: 400 });
    }

    // 1. Verify connection with Gmail SMTP
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: emailUser, pass: emailPass },
      tls: { rejectUnauthorized: false },
    });

    await transporter.verify();

    // 2. Persist to apps/web/.env.local
    const fs = await import('fs');
    const path = await import('path');
    const envPath = path.join(process.cwd(), '.env.local');

    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }

    if (envContent.includes('EMAIL_USER=')) {
      envContent = envContent.replace(/^EMAIL_USER=.*$/m, `EMAIL_USER=${emailUser}`);
    } else {
      envContent += `\nEMAIL_USER=${emailUser}`;
    }

    if (envContent.includes('EMAIL_PASS=')) {
      envContent = envContent.replace(/^EMAIL_PASS=.*$/m, `EMAIL_PASS=${emailPass}`);
    } else {
      envContent += `\nEMAIL_PASS=${emailPass}`;
    }

    fs.writeFileSync(envPath, envContent, 'utf-8');

    // Update in-memory process.env
    process.env.EMAIL_USER = emailUser;
    process.env.EMAIL_PASS = emailPass;
    process.env.SMTP_HOST = 'smtp.gmail.com';
    process.env.SMTP_PORT = '465';

    // 3. Send test email to verify real delivery
    let delivered = false;
    let messageId = '';
    try {
      const info = await transporter.sendMail({
        from: `"NearNest Verified" <${emailUser}>`,
        to: testRecipient,
        subject: '🎉 NearNest Real Email System Activated!',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
            <h2 style="color: #059669; margin-top: 0;">🎉 Real Email System Is Connected!</h2>
            <p style="color: #334155; font-size: 14px; line-height: 1.6;">
              Your Gmail SMTP integration is now active. Real emails will be delivered directly to <strong>${testRecipient}</strong> and all service providers/residents.
            </p>
            <div style="background-color: #f8fafc; padding: 14px; border-radius: 8px; font-size: 13px; color: #475569;">
              <strong>Configured Account:</strong> ${emailUser}<br/>
              <strong>Activated At:</strong> ${new Date().toLocaleString()}
            </div>
          </div>
        `,
      });
      delivered = true;
      messageId = info.messageId;
    } catch (testErr) {
      console.warn('Could not send test email, but credentials verified:', testErr);
    }

    return NextResponse.json({
      success: true,
      delivered,
      messageId,
      message: `SMTP Connected! Real emails will now be delivered to your inbox from ${emailUser}.`,
    });
  } catch (err: any) {
    return NextResponse.json({
      success: false,
      error: err?.message || 'SMTP Authentication Failed',
      tip: 'Please check that 2-Step Verification is enabled and use a 16-character Google App Password from https://myaccount.google.com/apppasswords',
    }, { status: 400 });
  }
}
