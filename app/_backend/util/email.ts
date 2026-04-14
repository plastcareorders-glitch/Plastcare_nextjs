// app/_backend/utils/email.ts
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: process.env.EMAIL_SECURE === "true",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Shared professional email layout wrapper
const emailWrapper = (content: string, title: string) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | PlastCare</title>
</head>
<body style="margin:0; padding:0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f8fafc; padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="100%" max-width="560px" cellpadding="0" cellspacing="0" border="0" style="max-width:560px; width:100%; background:white; border-radius:16px; box-shadow:0 10px 25px -5px rgba(0,0,0,0.05),0 8px 10px -6px rgba(0,0,0,0.02); overflow:hidden; border:1px solid #e2e8f0;">
          <!-- Header with gradient -->
          <tr>
            <td style="background:linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%); padding:32px 40px; text-align:center;">
              <h1 style="margin:0; font-size:28px; font-weight:700; color:white; letter-spacing:-0.02em;">PlastCare</h1>
              <p style="margin:8px 0 0; font-size:14px; color:rgba(255,255,255,0.9);">Quality Kitchen Essentials</p>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td style="padding:40px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="background:#f1f5f9; padding:24px 40px; text-align:center; border-top:1px solid #e2e8f0;">
              <p style="margin:0 0 8px; font-size:13px; color:#64748b;">
                <strong>PlastCare</strong> – Premium kitchen tools for Delhi NCR & UP
              </p>
              <p style="margin:0; font-size:12px; color:#94a3b8;">
                © ${new Date().getFullYear()} PlastCare. All rights reserved.
              </p>
              <div style="margin-top:16px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="color:#8b5cf6; text-decoration:none; font-size:13px; font-weight:500;">Visit Store</a>
                <span style="color:#cbd5e1; margin:0 8px;">|</span>
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/contact" style="color:#8b5cf6; text-decoration:none; font-size:13px; font-weight:500;">Contact Support</a>
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

export async function sendVerificationEmail(to: string, otp: string) {
  const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || "5";
  
  const content = `
    <h2 style="margin:0 0 16px; font-size:22px; font-weight:700; color:#1e293b; letter-spacing:-0.01em;">Verify your email address</h2>
    <p style="margin:0 0 24px; font-size:15px; line-height:1.6; color:#334155;">
      Thank you for choosing PlastCare! To complete your registration and start shopping our premium kitchen essentials, please use the verification code below.
    </p>
    <div style="background:#f8fafc; border-radius:12px; padding:24px; text-align:center; margin-bottom:24px; border:1px solid #e2e8f0;">
      <p style="margin:0 0 8px; font-size:13px; font-weight:600; color:#64748b; text-transform:uppercase; letter-spacing:1px;">Your Verification Code</p>
      <div style="font-size:42px; font-weight:800; letter-spacing:8px; color:#1e293b; font-family:'Courier New', monospace;">${otp}</div>
    </div>
    <p style="margin:0 0 8px; font-size:14px; color:#475569;">
      This code is valid for <strong style="color:#1e293b;">${expiryMinutes} minutes</strong>.
    </p>
    <p style="margin:0; font-size:14px; color:#64748b;">
      If you didn't create an account with PlastCare, please ignore this email.
    </p>
  `;

  const html = emailWrapper(content, "Verify Your Email");

  await transporter.sendMail({
    from: `"PlastCare" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "Verify your email address – PlastCare",
    html,
  });
}

export async function sendResetPasswordEmail(to: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
  
  const content = `
    <h2 style="margin:0 0 16px; font-size:22px; font-weight:700; color:#1e293b; letter-spacing:-0.01em;">Reset Your Password</h2>
    <p style="margin:0 0 24px; font-size:15px; line-height:1.6; color:#334155;">
      We received a request to reset the password for your PlastCare account. Click the button below to choose a new password.
    </p>
    <div style="text-align:center; margin:32px 0;">
      <a href="${resetUrl}" style="display:inline-block; background:linear-gradient(135deg, #a78bfa 0%, #8b5cf6 100%); color:white; font-weight:600; font-size:16px; padding:14px 36px; text-decoration:none; border-radius:8px; box-shadow:0 4px 6px -1px rgba(139,92,246,0.2); border:1px solid #7c3aed; transition:all 0.2s ease;">Reset Password</a>
    </div>
    <p style="margin:0 0 16px; font-size:14px; color:#475569;">
      Or copy and paste this link into your browser:
    </p>
    <div style="background:#f1f5f9; border-radius:8px; padding:14px; word-break:break-all; margin-bottom:24px; border:1px solid #e2e8f0;">
      <code style="font-size:13px; color:#1e293b;">${resetUrl}</code>
    </div>
    <p style="margin:0 0 8px; font-size:14px; color:#475569;">
      This link is valid for <strong style="color:#1e293b;">1 hour</strong>.
    </p>
    <p style="margin:0; font-size:14px; color:#64748b;">
      If you didn't request a password reset, please ignore this email or contact our support team.
    </p>
  `;

  const html = emailWrapper(content, "Reset Your Password");

  await transporter.sendMail({
    from: `"PlastCare" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "Reset Your Password – PlastCare",
    html,
  });
}