import mongoose from "mongoose";
import { dbQueries } from "../../../utils/db/queries.js";
import { itemsCategoryModal } from "./schema.js";

class CategoryServices {
  async create(value) {
    const findCategory = await itemsCategoryModal.findOne({
      title: value.title,
    });

    if (findCategory) {
      return { error: `${value.title} is already exist!`, status: 403 };
    }

    return await itemsCategoryModal.create({ ...value });
  }
  //   { course: id }
  async findAll(queries, param) {
    const { search = "", limits = 5, page = 1 } = queries;
    let limitsInNumber = Number(limits);
    let skipsOffset = (page - 1) * limitsInNumber;
    console.log(skipsOffset);

    let query = {};
    console.log("search", queries.search);

    if (search) {
      query = {
        title: { $regex: queries.search, $options: "i" },
      };
    }
    console.log(query);

    query.course = new mongoose.Types.ObjectId(param.id);

    console.log(query);
    const datas = await itemsCategoryModal.aggregate(
      dbQueries.paginationQuery(
        query,
        "category",
        skipsOffset,
        limitsInNumber,
        page
      )
    );

    console.log("result", datas);

    return datas;
  }

  async findOne(query) {
    return await itemsCategoryModal.findOne(query);
  }

  async update(id, value) {
    return itemsCategoryModal.findByIdAndUpdate(id, value, { $new: true });
  }

  async delete(id) {
    return itemsCategoryModal.findByIdAndDelete(id);
  }
}

export const categoryServices = new CategoryServices();
