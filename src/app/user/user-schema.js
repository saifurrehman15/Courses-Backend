import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    owner: { type: mongoose.Types.ObjectId, ref: "institutes" },
    institute: {
      duration: { type: String, default: "3 months" },
      instituteId: { type: mongoose.Types.ObjectId, ref: "institutes" },
    },
<<<<<<< Updated upstream
=======
    institute_sub_details: {
      plan: {
        type: String,
        default: "Free",
        enum: ["Free", "Pro", "Enterprise"],
      },
      paymentStatus: {
        type: String,
        default: "Unpaid",
        enum: ["Unpaid", "Active", "Expired"],
      },
      planLimit: { type: Number, default: 3 },
      subjectLimit: { type: Number, default: 10 },
      chaptersLimit: { type: Number, default: 5 },
      stripeCustomerId: String,
      stripeSessionId: String,
      planExpiresAt: Date,
    },
>>>>>>> Stashed changes
  },
  { timestamps: true }
);

export const userModel =
  mongoose.models.users || mongoose.model("users", UserSchema);
