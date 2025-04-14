import { courseModel } from "./schema.js";
import sendResponse from "../helper/response-sender.js";
import { updateSchema, validateSchema } from "./validate.js";
import { courseService } from "./services.js";
class CoursesController {
  async index(req, res) {
    const { limit = 10, page = 1, search = null } = req.query;
    try {
      const courses = await courseService.find({
        page: page,
        limit: Number(limit),
        search: search,
      });

      return sendResponse(res, 200, {
        error: false,
        message: "Courses fetched successfully!",
        data: courses,
      });
    } catch (err) {
      return sendResponse(res, 500, {
        error: true,
        message: err.message || "Internal server error!",
      });
    }
  }

  async show(req, res) {
    try {
      const course = await courseService.findById({ id: req.params.id });
      return sendResponse(res, 200, {
        error: false,
        message: "Course fetched successfully!",
        data: { course },
      });
    } catch (err) {
      return sendResponse(res, 500, {
        error: true,
        message: err.message || "Internal server error!",
      });
    }
  }

  async create(req, res) {
    try {
      const { error, value } = validateSchema.validate(req.body);
      if (error) {
        return sendResponse(res, 400, { error: true, message: error.message });
      }
      const course = await courseService.create({
        body: value,
        user: req.user,
      });
      return sendResponse(res, 201, {
        error: false,
        message: "Course created successfully!",
        data: { course },
      });
    } catch (err) {
      return sendResponse(res, 500, {
        error: true,
        message: err.message || "Internal server error!",
      });
    }
  }

  async update(req, res) {
    try {
      let { error, value } = updateSchema.validate(req.body);
      if (error) {
        return sendResponse(res, 400, { error: true, message: error.message });
      }
      const course = await courseService.update({
        id: req.params.id,
        body: value,
      });
      return sendResponse(res, 200, {
        error: false,
        message: "Course updated successfully!",
        data: { course },
      });
    } catch (err) {
      return sendResponse(res, 500, {
        error: true,
        message: err.message || "Internal server error!",
      });
    }
  }

  async delete(req, res) {
    try {
      const course = await courseService.delete({ id: req.params.id });
      return sendResponse(res, 200, {
        error: false,
        message: "Course deleted successfully!",
      });
    } catch (err) {
      return sendResponse(res, 500, {
        error: true,
        message: err.message || "Internal server error!",
      });
    }
  }
}

export const coursesController = new CoursesController();
