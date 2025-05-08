import mongoose from "mongoose";

const { Schema } = mongoose;

const StudentSchema = new Schema(
  {
    appliedBy: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    studentName: { type: String, required: true },
    studentAddress: { type: String, required: true },
    phone: { type: Number, required: true },
    studentCnic: { type: String, required: true },
    institute: {
      type: mongoose.Types.ObjectId,
      ref: "institutes",
      required: true,
    },
    status: {
      type: String,
      default: "pending",
      enums: ["pending", "approved", "rejected", "expired", "completed"],
    },
  },
  { timestamps: true }
);

export const studentModal =
  mongoose.models.students_appicants ||
  mongoose.model("students_appicants", StudentSchema);
