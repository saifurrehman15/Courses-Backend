import mongoose from "mongoose";
import { dbQueries } from "../../utils/db/queries.js";
import { courseModel } from "./schema.js";

class CourseService {
  async find({ page, limit, search }) {
    const skip = (page - 1) * limit;
    console.log(search);

    const matchStage = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { description: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    return await courseModel.aggregate(
      dbQueries.paginationQuery(matchStage, "courses", skip, limit, page)
    );
  }

  async findOwn({ page, limit, search, params }) {
    const skip = (page - 1) * limit;
    console.log(search);
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
        ],
      };
    }

    query.createdBy = new mongoose.Types.ObjectId(params.id);
    console.log(query);

  
    return await courseModel.aggregate(
      dbQueries.paginationQuery(query, "courses", skip, limit, page)
    );
  }

  async findOne(query) {
    return await courseModel.findOne(query);
  }

  async create({ createdBy, body }) {
    return await courseModel.create({ ...body, createdBy });
  }

  async update({ id, body }) {
    return await courseModel.findByIdAndUpdate(id, body, { new: true });
  }

  async delete({ id }) {
    await courseModel.findByIdAndDelete(id);
  }
}

export const courseService = new CourseService();
