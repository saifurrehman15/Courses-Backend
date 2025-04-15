import sendResponse from "../../helper/response-sender.js";
import { categoryServices } from "./services.js";
import { updateCategory, validateCategory } from "./validate.js";

class Category {
  async create(req, res) {
    try {
      const { error, value } = validateCategory.validate(req.body);

      if (error) {
        return sendResponse(res, 400, { error: true, message: error.message });
      }

      const category = await categoryServices.create({
        value,
        institute: req.user.owner,
      });

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
      console.log("hy", categories);

      if (!categories || categories.length == 0) {
        return sendResponse(res, 404, {
          error: true,
          message: "Course category not found!",
        });
      }

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

  async findOne(req, res) {
    try {
      const { id } = req.params;
      if (!id) {
        return sendResponse(res, 400, {
          error: true,
          message: "Id is not provided!",
        });
      }

      const service = await categoryServices.findOne({ _id: id });

      if (!service) {
        return sendResponse(res, 403, {
          error: true,
          message: "Failed to fetched category!",
        });
      }

      return sendResponse(res, 200, {
        error: true,
        message: "Category fetched successfully!",
        data: { category: service },
      });
    } catch (error) {
      console.error(error);
      return sendResponse(res, 500, {
        error: true,
        message: "Internal server error!",
      });
    }
  }

  async update(req, res) {
    const { error, value } = updateCategory.validate(req.body);

    if (error) {
      return sendResponse(res, 400, { error: true, message: error.message });
    }

    const updated = await categoryServices.update(req.params.id, value);

    if (!updated) {
      return sendResponse(res, 403, {
        error: true,
        message: "Failed to update caategory!",
      });
    }

    return sendResponse(res, 200, {
      error: false,
      message: "Category updated successfully!",
      data: { categories: updated },
    });
  }

  async delete(req, res) {
    try {
      const deleted = await categoryServices.delete(req.params.id);
      if (!deleted) {
        return sendResponse(res, 403, {
          error: true,
          message: "Failed to delete category!",
        });
      }

      return sendResponse(res, 200, {
        error: false,
        message: "Category deleted successfully!",
      });
    } catch (err) {
      return sendResponse(res, 500, {
        error: true,
        message: err || "Internal server error!",
      });
    }
  }
}

export const categoryController = new Category();
