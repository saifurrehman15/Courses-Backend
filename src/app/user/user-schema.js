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
  },
  { timestamps: true }
);

export const userModel =
  mongoose.models.users || mongoose.model("users", UserSchema);
