import mongoose from "mongoose";

const { Schema } = mongoose;

const CourseItemSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        // duration: { type: String, required: true },
        // price: { type: Number, required: true },
        // image: { type: String, required: true },
        // level: { type: String, required: true },
        // language: { type: String, required: true },
        // students: { type: Number, required: true },
        course: { type: mongoose.Types.ObjectId, required: true, ref: "courses" },
    }
    ,
    {
        timestamps: true,
    }
);
export const courseItemModel = mongoose.models.courses_items || mongoose.model("courses_items", CourseItemSchema);