import mongoose from "mongoose";

const { Schema } = mongoose;

const CourseItemSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "categories",
      required: true,
    },
    institute: {
      type: mongoose.Types.ObjectId,
      ref: "institutes",
      required: true,
    },
    url: { type: String, required: true },
    type: {
      type: String,
      required: true,
      default: "video ",
      enums: ["video", "pdfs", "word"],
    },
  },
  {
    timestamps: true,
  }
);
export const courseItemModel =
  mongoose.models.courses_items ||
  mongoose.model("courses_items", CourseItemSchema);
