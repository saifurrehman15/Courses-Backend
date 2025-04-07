import mongoose from "mongoose";

const { Schema } = mongoose;

const InstituteSchema = new Schema(
  {
    instituteName: { type: String, required: true },
    instituteAddress: { type: String, required: true },
    ownerCnic: { type: String, required: true },
    phone: { type: Number, required: true },
    approvedByAdmin: { type: Boolean, default: false },
    instituteLogo: { type: String },
    createdBy: { type: mongoose.Types.ObjectId, ref: "users", required: true },
  },
  { timestamps: true }
);

export const instituteModal =
  mongoose.models.institutes || mongoose.model("institutes", InstituteSchema);
