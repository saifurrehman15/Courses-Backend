import mongoose from "mongoose";

const { Schema } = mongoose;

const CourseSchema = new Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        // duration: { type: String, required: true },
        // price: { type: Number, required: true },
        // image: { type: String, required: true },
        // level: { type: String, required: true },
        // language: { type: String, required: true },
        // students: { type: Number, required: true },
        user: { type: mongoose.Types.ObjectId, required: true, ref: "users" },
    }
    ,
    {
        timestamps: true,
    }
);
export const courseModel = mongoose.models.courses || mongoose.model("courses", CourseSchema); 

