// app/_backend/models/user.model.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  password?: string;

  googleId?: string | null;
  authProvider: "local" | "google";
  profilePic?: string;

  failedAttempts: number;
  isLocked: boolean;
  lockoutUntil?: Date | null;

  lastLoginIp?: string;
  registrationIp?: string;

  phone?: string;
  isVerified: boolean;

  // OTP fields
  otpCode?: string;
  otpExpires?: Date;
  lastOtpSentAt?: Date | null; // ✅ cooldown tracking

  // Reset password fields
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;

  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    // ✅ NOT unique anymore
    username: {
      type: String,
      required: true,
      trim: true,
    },

    // ✅ unique identifier
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      default: "",
    },

    googleId: {
      type: String,
      default: null,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    profilePic: {
      type: String,
      default: "",
    },

    failedAttempts: {
      type: Number,
      default: 0,
    },

    isLocked: {
      type: Boolean,
      default: false,
    },

    lockoutUntil: {
      type: Date,
      default: null,
    },

    lastLoginIp: String,
    registrationIp: String,

    phone: {
      type: String,
      default: "",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // ✅ OTP system
    otpCode: String,
    otpExpires: Date,
    lastOtpSentAt: {
      type: Date,
      default: null,
    },

    // ✅ Password reset
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  }
);

// ✅ Indexes
UserSchema.index({ email: 1 });
UserSchema.index({ otpCode: 1 });

// ✅ Prevent model overwrite (Next.js hot reload safe)
export const User =
  models.User || model<IUser>("User", UserSchema);