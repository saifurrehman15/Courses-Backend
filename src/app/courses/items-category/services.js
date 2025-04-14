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

    let query = {};
    console.log("search", queries.search);

    if (search) {
      query = {
        title: { $regex: queries.search, $options: "i" },
      };
    }
    console.log(query);

    query.course = param.id;
    console.log(query);
    const datas = await itemsCategoryModal.aggregate(
      dbQueries.paginationQuery(
        query,
        "categories",
        skipsOffset,
        limitsInNumber,
        page
      )
    );

    console.log("result", datas);

    return datas;
  }
}

export const categoryServices = new CategoryServices();
