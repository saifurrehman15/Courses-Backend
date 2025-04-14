import mongoose from "mongoose";

const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    course: { type: mongoose.Types.ObjectId, ref: "courses", required: true },
    institute:{type:mongoose.Types.ObjectId,ref:"institutes",required:true},
    icon: { type: String, required: true },
  },
  { timestamps: true }
);

export const itemsCategoryModal =
  mongoose.models.categories || mongoose.model("categories", CategorySchema);
