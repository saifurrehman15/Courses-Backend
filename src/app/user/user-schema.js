import mongoose from "mongoose";

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    userName: { type: String },
    email: { type: String, required: true },
    bio: { type: String },
    password: { type: String },
    role: { type: String, default: "user" },
    owner: { type: mongoose.Types.ObjectId, ref: "institutes" },
    institute: {
      duration: String,
      instituteId: { type: mongoose.Types.ObjectId, ref: "institutes" },
    },
  },
  { timestamps: true }
);

export const userModel =
  mongoose.models.users || mongoose.model("users", UserSchema);
