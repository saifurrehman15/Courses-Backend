import Joi from "joi";
import { categoryModel } from "./schema.js";

class CategoriesController {
  async create(req, res) {
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });
    }

    try {
      const existing = await categoryModel.findOne({ name: value.name });
      if (existing) {
        return res
          .status(400)
          .json({ error: true, message: "Category already exists." });
      }

      const newCategory = await categoryModel.create({ name: value.name });
      return res
        .status(201)
        .json({ error: false, message: "Category created", data: newCategory });
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, message: "Internal server error" });
    }
  }

  async getAll(req, res) {
    try {
      const categories = await categoryModel.find().sort({ createdAt: -1 });
      return res
        .status(200)
        .json({ error: false, data: { category: categories } });
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, message: "Failed to fetch categories" });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await categoryModel.findByIdAndDelete(req.params.id);
      if (!deleted) {
        return res
          .status(404)
          .json({ error: true, message: "Category not found" });
      }
      return res
        .status(200)
        .json({ error: false, message: "Category deleted", data: deleted });
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, message: "Failed to delete category" });
    }
  }

  async update(req, res) {
    const schema = Joi.object({
      name: Joi.string().min(3).required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });
    }

    try {
      const updated = await categoryModel.findByIdAndUpdate(
        req.params.id,
        { name: req.body.name },
        { new: true }
      );

      if (!updated) {
        return res
          .status(404)
          .json({ error: true, message: "Category not found" });
      }

      return res
        .status(200)
        .json({ error: false, message: "Category updated", data: updated });
    } catch (err) {
      return res
        .status(500)
        .json({ error: true, message: "Failed to update category" });
    }
  }
}

const categoryListController = new CategoriesController();
export default categoryListController;
