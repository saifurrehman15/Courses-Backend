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

  async findById({ id }) {
    return await courseModel.findById(id);
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
