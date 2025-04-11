import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    // userName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, default: "user" },
    institute: {
      instituteId: { type: mongoose.Types.ObjectId, ref: "institutes" },
      duration: { type: String },
    },
  },
  { timestamps: true }
);

export const userModel =
  mongoose.models.users || mongoose.model("users", UserSchema);
