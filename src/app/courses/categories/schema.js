import mongoose from "mongoose";

const { Schema } = mongoose;

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
  },
  { timestamps: true }
);

export const categoryModel =
  mongoose.models.categories || mongoose.model("categories", CategorySchema);
