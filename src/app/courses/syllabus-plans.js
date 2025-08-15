import mongoose from "mongoose";

const { Schema } = mongoose;

const SyllabusSchema = new Schema({
  courseId: { type: mongoose.Types.ObjectId, ref: "courses", required: true },
  syllabusLimit: { type: Number, default: 3 },
  instituteId: { type: mongoose.Types.ObjectId, ref: "institutes" },
});

export const syllabusPlansModel =
  mongoose.models.syllabus_plans ||
  mongoose.model("syllabus_plans", SyllabusSchema);
