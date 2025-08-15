import mongoose from "mongoose";

const { Schema } = mongoose;

const ChaptersSchema = new Schema({
  courseId: { type: mongoose.Types.ObjectId, ref: "courses", required: true },
  chaptersLimit: { type: Number, default: 5 },
  instituteId: { type: mongoose.Types.ObjectId, ref: "institutes" },
});

export const chaptersPlansModel =
  mongoose.models.chapters_plans ||
  mongoose.model("chapters_plans", ChaptersSchema);
