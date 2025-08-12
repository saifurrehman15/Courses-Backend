import mongoose from "mongoose";
import { dbQueries } from "../../utils/db/queries.js";
import { userModel } from "../user/user-schema.js";
import { instituteModal } from "./schema.js";
import { courseService } from "../courses/services.js";
import { studentServices } from "../student/services.js";
import { studentModal } from "../student/schema.js";
import { client, connectRedis } from "../../utils/configs/redis/index.js";

class InstituteServices {
  async create({ body, user }) {
    const findInstitute = await instituteModal.findOne({
      $or: [{ ownerCnic: body.ownerCnic }, { createdBy: user._id }],
    });

    if (findInstitute) {
      return {
        error: "You can only create one institute with this account!",
        status: 403,
      };
    }

    const instituteCreated = await instituteModal.create({
      ...body,
      createdBy: user._id,
    });

    await userModel.findByIdAndUpdate(user._id, {
      $set: {
        owner: instituteCreated._id,
      },
    });
    return instituteCreated;
  }

  async findAll(queries) {
    await connectRedis();

    const { search, limits = 5, page = 1 } = queries;
    const limitsInNumber = Number(limits);
    const skipsOffset = (page - 1) * limitsInNumber;

    let query = {};
    if (search) {
      query = {
        $or: [
          { instituteName: { $regex: queries.search, $options: "i" } },
          { instituteAddress: { $regex: queries.search, $options: "i" } },
        ],
      };
    }

    const cache = `institutes:page=${page}&&limit=${limitsInNumber}&&skip=${skipsOffset}&&search=${search || ""}`;
    const data = await client.get(cache);

    if (data) {
      return JSON.parse(data);
    }

    const result = await instituteModal.aggregate(
      dbQueries.paginationQuery(
        query,
        "institutes",
        skipsOffset,
        limitsInNumber,
        page
      )
    );

    if (Array.isArray(result[0]?.institutes)) {
      const updatedInstitutes = await Promise.all(
        result[0].institutes.map(async (ins) => {
          try {
            const [courses, students] = await Promise.all([
              courseService.findOwn({
                hasQuery: true,
                queries: { createdBy: ins._id },
              }),
              studentModal.find({
                institute: ins._id,
              }),
            ]);

            return {
              ...ins,
              courses: courses.length || 0,
              students: students.length || 0,
            };
          } catch (err) {
            console.error("Error for institute:", ins._id, err);
            return {
              ...ins,
              courses: 0,
              students: 0,
              error: true,
            };
          }
        })
      );

      result[0].institutes = updatedInstitutes;
    }
    await client.set(cache, JSON.stringify(result), "EX", 60 * 60 * 24);
    return result;
  }

  async findOne(query) {
    return await instituteModal.findOne(query).lean();
  }

  async updateDoc({ id, value }) {
    return await instituteModal
      .findByIdAndUpdate(id, { ...value }, { new: true })
      .lean();
  }

  async deleteDoc(id) {
    const deleted = await instituteModal.findByIdAndDelete(id).lean();

    await userModel.findByIdAndUpdate(deleted.createdBy, {
      $unset: {
        owner: "",
      },
    });

    return deleted;
  }
}

export const instituteService = new InstituteServices();
