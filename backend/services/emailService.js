import nodemailer from 'nodemailer';

let transporter = null;

const getTransporter = () => {
  if (transporter) return transporter;

  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }
  return transporter;
};

export const sendEmail = async ({ to, subject, html, text }) => {
  const mailer = getTransporter();

  if (!mailer) {
    console.log(`\n📨 [Simulated Email Service]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Content:\n${text || html}\n`);
    return { simulated: true, success: true };
  }

  try {
    const info = await mailer.sendMail({
      from: process.env.SMTP_FROM || '"EventSphere Management" <support@eventsphere.pk>',
      to,
      subject,
      text,
      html
    });
    console.log(`[EmailService] Message dispatched: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[EmailService] Dispatch error:', error.message);
    return { success: false, error: error.message };
  }
};

export const sendPasswordResetEmail = async (email, resetToken, host) => {
  const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/login?resetToken=${resetToken}`;
  const subject = 'EventSphere — Password Reset Instructions';
  const text = `You requested a password reset for your EventSphere account.\n\nPlease reset your password using this link:\n${resetUrl}\n\nThis link is valid for 1 hour. If you did not request this, please ignore this email.`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #0f172a; margin-top: 0;">EventSphere Password Recovery</h2>
      <p style="color: #475569; font-size: 14px;">We received a request to reset your password. Click the button below to set a new password:</p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${resetUrl}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 14px; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #64748b; font-size: 12px;">Link expires in 60 minutes. If you did not initiate this request, no action is needed.</p>
    </div>
  `;

  return await sendEmail({ to: email, subject, text, html });
};
