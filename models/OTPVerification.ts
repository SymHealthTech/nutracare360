import mongoose from "mongoose";

export interface IOTPVerification {
  email: string;
  otp: string;
  practitionerId: string;
  editToken?: string;
  isUsed: boolean;
  expiresAt: Date;
  createdAt: Date;
}

const OTPVerificationSchema = new mongoose.Schema<IOTPVerification>({
  email: { type: String, required: true, lowercase: true, trim: true },
  otp: { type: String, required: true },
  practitionerId: { type: String, required: true },
  editToken: { type: String, default: null },
  isUsed: { type: Boolean, default: false },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
});

// TTL index — MongoDB auto-deletes expired documents
OTPVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.OTPVerification ||
  mongoose.model<IOTPVerification>("OTPVerification", OTPVerificationSchema);
