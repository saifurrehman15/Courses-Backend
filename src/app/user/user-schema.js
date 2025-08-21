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
      plan: {
        type: String,
        default: "Free",
        enum: ["Free", "Pro", "Enterprise"],
      },
      paymentStatus: {
        type: String,
        default: "Unpaid",
        enum: ["Unpaid", "Paid", "Expired"],
      },
      planLimit: {
        type: Schema.Types.Mixed,
        default: 3,
      },
      stripePaymentId: String,
      stripeSessionId: String,
      orderId: String,
      billingCycle: { type: String, default: "monthly" },
      purchaseTime: { type: Date, default: Date.now },
    },
  },
  { timestamps: true }
);

export const userModel =
  mongoose.models.users || mongoose.model("users", UserSchema);
