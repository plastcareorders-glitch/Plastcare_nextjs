// app/_backend/utils/email.ts (add new function)
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

export async function sendVerificationEmail(to: string, otp: string) {
  const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || "5";
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <h2>Verify your email address</h2>
      <p>Thank you for registering. Use the OTP below to complete your verification:</p>
      <div style="font-size: 28px; font-weight: bold; letter-spacing: 4px; background: #f4f4f4; padding: 12px; text-align: center; border-radius: 8px;">
        ${otp}
      </div>
      <p>This OTP is valid for <strong>${expiryMinutes} minutes</strong>.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr />
      <small>© ${new Date().getFullYear()} Your App Name</small>
    </div>
  `;

  await transporter.sendMail({
    from: `"Your App Name" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "Verify your email - OTP",
    html,
  });
}

// ✅ NEW: Send password reset email
export async function sendResetPasswordEmail(to: string, resetToken: string) {
  const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>You requested to reset your password. Click the link below to set a new password:</p>
      <a href="${resetUrl}" style="display: inline-block; background: #0070f3; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; margin: 16px 0;">
        Reset Password
      </a>
      <p>Or copy and paste this link into your browser:</p>
      <p style="word-break: break-all;">${resetUrl}</p>
      <p>This link is valid for <strong>1 hour</strong>.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr />
      <small>© ${new Date().getFullYear()} Your App Name</small>
    </div>
  `;

  await transporter.sendMail({
    from: `"Your App Name" <${process.env.EMAIL_FROM}>`,
    to,
    subject: "Reset Your Password",
    html,
  });
}