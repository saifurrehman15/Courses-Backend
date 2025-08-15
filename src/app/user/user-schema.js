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
<<<<<<< HEAD
<<<<<<< Updated upstream
=======
    institute_sub_details: {
      plan: {
        type: String,
        default: "Free",
        enum: ["Free", "Pro", "Enterprise"],
      },
=======
    institute_sub_details: {
      plan: { type: String, default: "Free", enum: ["Free", "Basic", "Pro"] },
>>>>>>> 97e74d51c5bc44ec865d7fd2a70eece5e4954b0a
      paymentStatus: {
        type: String,
        default: "Unpaid",
        enum: ["Unpaid", "Active", "Expired"],
      },
      planLimit: { type: Number, default: 3 },
<<<<<<< HEAD
      subjectLimit: { type: Number, default: 10 },
      chaptersLimit: { type: Number, default: 5 },
=======
>>>>>>> 97e74d51c5bc44ec865d7fd2a70eece5e4954b0a
      stripeCustomerId: String,
      stripeSessionId: String,
      planExpiresAt: Date,
    },
<<<<<<< HEAD
>>>>>>> Stashed changes
=======
>>>>>>> 97e74d51c5bc44ec865d7fd2a70eece5e4954b0a
  },
  { timestamps: true }
);

export const userModel =
  mongoose.models.users || mongoose.model("users", UserSchema);
