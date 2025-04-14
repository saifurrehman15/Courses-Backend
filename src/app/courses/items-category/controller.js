import sendResponse from "../../helper/response-sender.js";
import { categoryServices } from "./services.js";
import { validateCategory } from "./validate.js";

class Category {
  async create(req, res) {
    try {
      const { error, value } = validateCategory.validate(req.body);

      if (error) {
        return sendResponse(res, 400, { error: true, message: error.message });
      }

      const category = await categoryServices.create(value);

      if (category.error) {
        return sendResponse(res, category.status, {
          error: true,
          message: category.error,
        });
      }

      return sendResponse(res, 201, {
        error: false,
        message: "Category created successfully!",
        data: {
          categories: category,
        },
      });
    } catch (error) {
      return sendResponse(res, 500, {
        error: true,
        message: error || "Internal server error!",
      });
    }
  }

  async findAll(req, res) {
    try {
      const categories = await categoryServices.findAll(req.query, req.params);
      console.log("hy",categories);
      
      return sendResponse(res, 200, {
        error: false,
        message: "Categories fetched successfully!",
        data: { ...categories[0] },
      });
    } catch (err) {
      return sendResponse(res, 200, {
        error: true,
        message: err || "Internal server error!",
      });
    }
  }
}

export const categoryController = new Category();
