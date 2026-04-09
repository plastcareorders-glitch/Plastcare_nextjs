// models/admin.model.ts
import mongoose, { Schema, Document, models, model } from "mongoose";

// TypeScript interface for Admin document
export interface IAdmin extends Document {
  username: string;
  email: string;
  password: string;

  // Login security
  failedAttempts: number;
  isLocked: boolean;
  lockoutUntil: Date | null;

  // IP tracking
  lastLoginIp?: string;
  registrationIp?: string;

  // Timestamps (automatically added)
  createdAt: Date;
  updatedAt: Date;
}

// Admin schema definition
const AdminSchema = new Schema<IAdmin>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Login Security
    failedAttempts: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    lockoutUntil: { type: Date, default: null },

    lastLoginIp: { type: String },
    registrationIp: { type: String },
  },
  { timestamps: true }
);

// Prevent model re-compilation error in Next.js dev environment
export const Admin = models.Admin || model<IAdmin>("Admin", AdminSchema);