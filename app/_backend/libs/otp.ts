// app/_backend/utils/otp.ts
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getOTPExpiry(): Date {
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES || "5", 10);
  return new Date(Date.now() + expiryMinutes * 60 * 1000);
}