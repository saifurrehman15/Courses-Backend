import sendResponse from "../../helper/response-sender.js";
import { chaptersPlansModel } from "../chapters-plans.js";
import { itemsCategoryModal } from "../course-items/schema.js";
import { courseItemModel } from "./schema.js";
import { courseItemsService } from "./services.js";

import { validateSchema, validateSchemaUpdate } from "./validate.js";

class CoursesItemsController {
  async create(req, res) {
    try {
      const { limitCount } = req;
      const instituteId = req.user?.owner;

      if (!instituteId) {
        return sendResponse(res, 404, {
          error: true,
          message: "You didn't have access to this course!",
        });
      }

      const { error, value } = validateSchema.validate(req.body);
      if (error) {
        return sendResponse(res, 400, { error: true, message: error.message });
      }

      const subject = await itemsCategoryModal.findById(value.category);
      if (!subject) {
        return sendResponse(res, 404, {
          error: true,
          message: "Course not found!",
        });
      }

      if (limitCount || limitCount === 0) {
        await chaptersPlansModel.findOneAndUpdate(
          { courseId: value.course },
          {
            $set: {
              chaptersLimit: limitCount,
            },
          }
        );
      }

      const courseItem = await courseItemModel.create({
        ...value,
        institute: instituteId,
      });

      return sendResponse(res, 201, {
        error: false,
        message: "Course Chapter created successfully!",
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
      console.log("Course Id===>>>", courseId);

      const courseExists = await itemsCategoryModal.findOne({
        $or: [{ course: courseId }, { institute: courseId }, { _id: courseId }],
      });
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
      console.log("Course Items", courseItems);

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

      const courseItem = await courseItemModel
        .findById(courseItemId)
        .populate("category", "_id title");
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
      const { error, value } = validateSchemaUpdate.validate(req.body);
            console.log(error,value);

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
