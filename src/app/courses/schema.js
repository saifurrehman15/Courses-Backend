import mongoose from "mongoose";

const { Schema } = mongoose;

const CourseSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    level: { type: String, required: true },
    category: { type: String, required: true },
    createdBy: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "institutes",
    },
    courseType: {
      type: { type: String, required: true, default: "free" },
      price: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);
export const courseModel =
  mongoose.models.courses || mongoose.model("courses", CourseSchema);
