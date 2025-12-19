/**
 * Email Service - Real SMTP Email Sending with Nodemailer
 * 
 * Sends real emails via SMTP (Gmail, SendGrid, etc.)
 */

import nodemailer from 'nodemailer';

export interface EmailPayload {
  to: string;
  subject: string;
  body: string;
  html?: string;
}

// Create SMTP transporter
const createTransporter = () => {
  const smtpEnabled = process.env.SMTP_ENABLED === 'true';
  
  if (!smtpEnabled) {
    console.log('⚠️  SMTP disabled - using log-only mode');
    return null;
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for 587
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });
};

/**
 * Send email via SMTP or log-only mode
 */
export async function sendEmail(payload: EmailPayload): Promise<void> {
  const transporter = createTransporter();

  // Log-only mode
  if (!transporter) {
    console.log('\n=================================');
    console.log('📧 EMAIL SENT (LOG-ONLY MODE)');
    console.log('=================================');
    console.log(`To: ${maskEmail(payload.to)}`);
    console.log(`Subject: ${payload.subject}`);
    console.log(`Body:\n${payload.body}`);
    if (payload.html) {
      console.log(`HTML: ${payload.html.substring(0, 100)}...`);
    }
    console.log('=================================\n');
    await new Promise((resolve) => setTimeout(resolve, 500));
    return;
  }

  // Real SMTP mode
  try {
    console.log(`\n📧 Sending email to ${maskEmail(payload.to)}...`);
    
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: payload.to,
      subject: payload.subject,
      text: payload.body,
      html: payload.html || payload.body,
    });

    console.log('✅ Email sent successfully!');
    console.log(`Message ID: ${info.messageId}`);
    console.log(`Response: ${info.response}`);
  } catch (error: any) {
    console.error('❌ Failed to send email:', error.message);
    throw new Error(`Email sending failed: ${error.message}`);
  }
}

/**
 * Generate custom email content
 */
export function generateCustomEmail(data: {
  to: string;
  subject: string;
  body: string;
}): EmailPayload {
  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; white-space: pre-wrap; }
    .footer { text-align: center; color: #888; margin-top: 30px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📧 ${data.subject}</h1>
    </div>
    <div class="content">
      ${data.body}
    </div>
    <div class="footer">
      <p>Баярлалаа,<br><strong>Yellow Books баг</strong></p>
      <p>© 2025 Yellow Books. Бүх эрх хуулиар хамгаалагдсан.</p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return { to: data.to, subject: data.subject, body: data.body, html };
}

/**
 * Generate sign-in notification email content
 */
export function generateSignInEmail(data: {
  name: string;
  email: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string;
  provider: string;
}): EmailPayload {
  const formattedDate = new Date(data.timestamp).toLocaleString('mn-MN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const subject = '🔐 Таны бүртгэлд нэвтэрсэн байна - Yellow Books';
  
  const body = `
Сайн байна уу ${data.name},

Таны Yellow Books бүртгэлд амжилттай нэвтэрсэн байна.

Нэвтрэлтийн мэдээлэл:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📧 Имэйл: ${data.email}
🌐 Provider: ${data.provider}
📍 IP Address: ${data.ipAddress}
💻 Browser: ${data.userAgent.substring(0, 50)}...
⏰ Огноо: ${formattedDate}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Хэрэв та энэ нэвтрэлтийг хийгээгүй бол нэн даруй бидэнтэй холбогдоно уу.

Баярлалаа,
Yellow Books баг
  `.trim();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
    .info-box { background: white; padding: 20px; border-left: 4px solid #667eea; margin: 20px 0; }
    .info-row { display: flex; padding: 10px 0; border-bottom: 1px solid #eee; }
    .info-label { font-weight: bold; width: 120px; color: #667eea; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin-top: 20px; }
    .footer { text-align: center; color: #888; margin-top: 30px; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 Нэвтрэлтийн мэдэгдэл</h1>
    </div>
    <div class="content">
      <p>Сайн байна уу <strong>${data.name}</strong>,</p>
      <p>Таны <strong>Yellow Books</strong> бүртгэлд амжилттай нэвтэрсэн байна.</p>
      
      <div class="info-box">
        <h3>📋 Нэвтрэлтийн мэдээлэл</h3>
        <div class="info-row">
          <div class="info-label">📧 Имэйл:</div>
          <div>${data.email}</div>
        </div>
        <div class="info-row">
          <div class="info-label">🌐 Provider:</div>
          <div>${data.provider}</div>
        </div>
        <div class="info-row">
          <div class="info-label">📍 IP Address:</div>
          <div>${data.ipAddress}</div>
        </div>
        <div class="info-row">
          <div class="info-label">💻 Browser:</div>
          <div>${data.userAgent.substring(0, 80)}...</div>
        </div>
        <div class="info-row">
          <div class="info-label">⏰ Огноо:</div>
          <div>${formattedDate}</div>
        </div>
      </div>

      <div class="warning">
        ⚠️ <strong>Анхааруулга:</strong> Хэрэв та энэ нэвтрэлтийг хийгээгүй бол нэн даруй бидэнтэй холбогдоно уу.
      </div>

      <div class="footer">
        <p>Баярлалаа,<br><strong>Yellow Books баг</strong></p>
        <p>© 2025 Yellow Books. Бүх эрх хуулиар хамгаалагдсан.</p>
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();

  return { to: data.email, subject, body, html };
}

/**
 * Mask email for privacy in logs
 */
function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  
  const maskedLocal = local.length > 2 
    ? `${local[0]}${'*'.repeat(local.length - 2)}${local[local.length - 1]}`
    : local;
  
  return `${maskedLocal}@${domain}`;
}

export default {
  sendEmail,
  generateSignInEmail,
  generateCustomEmail,
};
