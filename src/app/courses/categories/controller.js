import Joi from "joi";
import { categoryModel } from "./schema.js";
import { client, connectRedis } from "../../../utils/configs/redis/index.js";

class CategoriesController {
  async create(req, res) {
    const schema = Joi.object({
      title: Joi.string().min(3).required(),
    });

    const { error, value } = schema.validate(req.body);
    if (error) {
      return res
        .status(400)
        .json({ error: true, message: error.details[0].message });
    }

    try {
      const existing = await categoryModel.findOne({ name: value.title });
      if (existing) {
        return res
          .status(400)
          .json({ error: true, message: "Category already exists." });
      }

      const newCategory = await categoryModel.create({ title: value.title });
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
      // await connectRedis();

      // const data = await client.get("categories");
      // if (data) {
      //   console.log("categories get from redis", data);
      //   return res
      //     .status(200)
      //     .json({ error: false, data: { category: JSON.parse(data) } });
      // }
      
      const categories = await categoryModel.find().sort({ createdAt: -1 });
      
      // await client.set("categories", JSON.stringify(categories), {
      //   EX: 60 * 60 * 24, 
      // });
      
      console.log("categories set to redis");
      
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
      title: Joi.string().min(3).required(),
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
        { title: req.body.title },
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

const courseListController = new CategoriesController();
export default courseListController;
