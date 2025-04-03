import mongoose from "mongoose";

const { Schema } = mongoose;

const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    createdBy: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    // duration: { type: String, required: true },
    // price: { type: Number, required: true },
    // image: { type: String, required: true },
    // level: { type: String, required: true },
    // language: { type: String, required: true },
    // students: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);
export const courseModel =
  mongoose.models.courses || mongoose.model("courses", CourseSchema);
