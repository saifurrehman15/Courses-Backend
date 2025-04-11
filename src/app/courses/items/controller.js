import sendResponse from "../../helper/response-sender.js";
import { courseModel } from "../schema.js";

import { courseService } from "../services.js";
import { courseItemModel } from "./schema.js";
import { courseItemsService } from "./services.js";

import { validateSchema } from "./validate.js";

class CoursesItemsController {
  async index(req, res) {
    const { limit = 10, page = 1, search = null } = req.query;
    try {
      const courseId = req.params.id;
      const courseExists = await courseService.findById({ id: courseId });

      if (!courseExists) {
        return sendResponse(res, 404, {
          error: true,
          message: "Course not found!",
        });
      }

      const courseItems = await courseItemsService.find({
        courseId: courseId,
        page: page,
        limit: Number(limit),
        search: search,
      });
      return sendResponse(res, 200, {
        error: false,
        message: "Course items fetched successfully!",
        data: { course: courseExists, courseItems },
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
      const courseId = req.params.id;
      const courseExists = await courseModel.findById(courseId);
      if (!courseExists) {
        return sendResponse(res, 404, {
          error: true,
          message: "Course not found!",
        });
      }
      const { error, value } = validateSchema.validate(req.body);
      if (error) {
        return sendResponse(res, 400, { error: true, message: error.message });
      }
      const courseItem = await courseItemModel.create({
        ...value,
        course: courseId,
      });
      return sendResponse(res, 201, {
        error: false,
        message: "Course item created successfully!",
        data: { courseItem },
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
      const courseItemId = req.params.id;
      const courseItem = await courseItemModel.findById(courseItemId);
      return sendResponse(res, 200, {
        error: false,
        message: "Course item fetched successfully!",
        data: { courseItem },
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
      const courseItemId = req.params.id;
      const courseItem = await courseItemModel.findById(courseItemId);
      if (!courseItem) {
        return sendResponse(res, 404, {
          error: true,
          message: "Course item not found!",
        });
      }
      const { error, value } = validateSchema.validate(req.body);
      if (error) {
        return  sendResponse(res, 400, { error: true, message: error.message });
      }
      courseItem.set(value);
      await courseItem.save();
      return   sendResponse(res, 200, {
        error: false,
        message: "Course item updated successfully!",
        data: { courseItem },
      });
    } catch (err) {
      return  sendResponse(res, 500, {
        error: true,
        message: err.message || "Internal server error!",
      });
    }
  }

  async delete(req, res) {
    try {
      const courseItemId = req.params.id;
      const courseItem = await courseItemModel.findByIdAndDelete(courseItemId);
      return   sendResponse(res, 200, {
        error: false,
        message: "Course item deleted successfully!",
      });
    } catch (err) {
      return    sendResponse(res, 500, {
        error: true,
        message: err.message || "Internal server error!",
      });
    }
  }
}

export const coursesItemsController = new CoursesItemsController();
