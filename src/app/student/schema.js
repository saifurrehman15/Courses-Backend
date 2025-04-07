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
      ref: "institute",
      required: true,
    },
  },
  { timestamps: true }
);

export const studentModal =
  mongoose.models.students || mongoose.model("students", StudentSchema);
