import sendResponse from "../../helper/response-sender.js";
import { itemsCategoryModal } from "../items-category/schema.js";
import { courseItemModel } from "./schema.js";
import { courseItemsService } from "./services.js";

import { validateSchema } from "./validate.js";

class CoursesItemsController {
  async create(req, res) {
    try {
      const { error, value } = validateSchema.validate(req.body);
      if (error) {
        return sendResponse(res, 400, { error: true, message: error.message });
      }

      const courseExists = await itemsCategoryModal.findById(value.category);
      if (!courseExists) {
        return sendResponse(res, 404, {
          error: true,
          message: "Course not found!",
        });
      }

      const courseItem = await courseItemModel.create({ ...value });

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

  async index(req, res) {
    const { limit = 10, page = 1, search = null } = req.query;
    try {
      const courseId = req.params.id;
      console.log(courseId);

      const courseExists = await itemsCategoryModal.findById(courseId);
      console.log(courseExists);

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
        data: { category: courseExists, ...courseItems[0] },
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
      if (!courseItem) {
        return sendResponse(res, 404, {
          error: true,
          message: "The course item not found!",
        });
      }
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
      const { error, value } = validateSchema.validate(req.body);
      if (error) {
        return sendResponse(res, 400, { error: true, message: error.message });
      }
      const courseItemId = req.params.id;
      const courseItem = await courseItemModel.findById(courseItemId);
      if (!courseItem) {
        return sendResponse(res, 404, {
          error: true,
          message: "Course item not found!",
        });
      }

      const updatedItem = await courseItemModel.findByIdAndUpdate(
        courseItemId,
        value,
        { $new: true }
      );

      return sendResponse(res, 200, {
        error: false,
        message: "Course item updated successfully!",
        data: { updatedItem },
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
      const courseItemId = req.params.id;
      const courseItem = await courseItemModel.findByIdAndDelete(courseItemId);
      return sendResponse(res, 200, {
        error: false,
        message: "Course item deleted successfully!",
      });
    } catch (err) {
      return sendResponse(res, 500, {
        error: true,
        message: err.message || "Internal server error!",
      });
    }
  }
}

export const coursesItemsController = new CoursesItemsController();
