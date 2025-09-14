import mongoose from "mongoose";

const { Schema } = mongoose;

const CourseItemSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "course_items",
      required: true,
    },
    course: {
      type: mongoose.Types.ObjectId,
      ref: "courses",
      required: true,
    },
    institute: {
      type: mongoose.Types.ObjectId,
      ref: "institutes",
      required: true,
    },
    content: [
      {
        title: { type: String, required: true },
        url: { type: String, required: true },
        description: { type: String, required: true },
        type: {
          type: String,
          required: true,
          default: "video",
          enums: ["video", "pdf", "word"],
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);
export const courseItemModel =
  mongoose.models.course_materials ||
  mongoose.model("course_materials", CourseItemSchema);
