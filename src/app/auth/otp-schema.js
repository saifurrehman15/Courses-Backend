import mongoose from "mongoose";

const { Schema } = mongoose;

const OtpSchema = new Schema(
  {
    email: { type: String, required: true },
    otp: { type: String, required: true },
    isExpire: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const otpModel =
  mongoose.models.otps || mongoose.model("otps", OtpSchema);
