import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    userName: { type: String },
    email: { type: String, required: true },
    bio: { type: String },
    profile: { type: String },
    password: { type: String },
    role: { type: String, default: "user" },
    owner: { type: mongoose.Types.ObjectId, ref: "institutes" },
    institute: {
      duration: String,
      instituteId: { type: mongoose.Types.ObjectId, ref: "institutes" },
    },
    institute_sub_details: {
      plan: { type: String, default: "Free", enum: ["Free", "Basic", "Pro"] },
      freeCourseUsed: { type: Boolean, default: false },
      paymentStatus: {
        type: String,
        default: "Unpaid",
        enum: ["Unpaid", "Active", "Expired"],
      },
      stripeCustomerId: String,
      stripeSessionId: String,
      planExpiresAt: Date,
    },
  },
  { timestamps: true }
);

export const userModel =
  mongoose.models.users || mongoose.model("users", UserSchema);
