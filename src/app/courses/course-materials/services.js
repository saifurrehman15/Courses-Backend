import mongoose from "mongoose";
import sendResponse from "../../helper/response-sender.js";
import { courseModel } from "../schema.js";
import { courseItemModel } from "./schema.js";
import { validateSchema } from "./validate.js";
import { dbQueries } from "../../../utils/db/queries.js";

class CoursesItemsService {
  async find({ courseId, page, limit, search }) {
    console.log(courseId);
    const skip = (page - 1) * limit;
    console.log(search);

    const checkingIds = [
      { category: new mongoose.Types.ObjectId(courseId) },
      { institute: new mongoose.Types.ObjectId(courseId) },
    ];

    let query = {};

    if (search) {
      query = {
        $and: [
          {
            $or: [
              { title: { $regex: search, $options: "i" } },
              { description: { $regex: search, $options: "i" } },
            ],
          },
          { $or: checkingIds },
        ],
      };
    } else {
      query = {
        $or: checkingIds,
      };
    }

    console.log(query);

    const result = await courseItemModel.aggregate(
      dbQueries.paginationQuery(query, "courses_items", skip, limit, page),
    );

    return result;
  }
}

export const courseItemsService = new CoursesItemsService();
