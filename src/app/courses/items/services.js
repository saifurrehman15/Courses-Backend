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
    const matchStage = search
      ? {
          category: new mongoose.Types.ObjectId(courseId),
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {
          category: new mongoose.Types.ObjectId(courseId),
        };
    return await courseItemModel.aggregate(
      dbQueries.paginationQuery(matchStage, "courses_items", skip, limit, page)
    );
  }
}

export const courseItemsService = new CoursesItemsService();
