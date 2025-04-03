import { courseModel } from "./schema.js";
import sendResponse from "../helper/response-sender.js";
import { validateSchema } from "./validate.js";
class CoursesController {
    async index(req, res) {
        try {
            const courses = await courseModel.find();
            sendResponse(res, 200, {
                error: false,
                message: "Courses fetched successfully!",
                data: { courses }
            });
        }
        catch (err) {
            sendResponse(res, 500, {
                error: true,
                message: err.message || "Internal server error!"
            });
        }
    }

    async show (req, res) {
        try {
            const course = await courseModel.findById(req.params.id);
            sendResponse(res, 200, {
                error: false,
                message: "Course fetched successfully!",
                data: { course }
            });
        }
        catch (err) {
            sendResponse(res, 500, {
                error: true,
                message: err.message || "Internal server error!"
            });
        }
    }

    async create(req, res) {
        try {

            const { error, value } = validateSchema.validate(req.body); 

            if (error) {
                sendResponse(res, 400, { error: true, message: error.message });
            }

            const course = await courseModel.create(value);
            sendResponse(res, 201, {
                error: false,
                message: "Course created successfully!",
                data: { course }
            });
        }
        catch (err) {
            sendResponse(res, 500, {
                error: true,
                message: err.message || "Internal server error!"
            });
        }
    }

    async update(req, res) {
        try {
            const course = await courseModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
            sendResponse(res, 200, {
                error: false,
                message: "Course updated successfully!",
                data: { course }
            });
        }
        catch (err) {
            sendResponse(res, 500, {
                error: true,
                message: err.message || "Internal server error!"
            });
        }
    }

    async delete(req, res) {
        try {
            const course = await courseModel.findByIdAndDelete(req.params.id);
            sendResponse(res, 200, {
                error: false,
                message: "Course deleted successfully!",
                data: { course }
            });
        }
        catch (err) {
            sendResponse(res, 500, {
                error: true,
                message: err.message || "Internal server error!"
            });
        }
    }

}

export const coursesController = new CoursesController(); 