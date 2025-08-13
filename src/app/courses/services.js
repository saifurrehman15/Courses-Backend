import mongoose from "mongoose";
import { dbQueries } from "../../utils/db/queries.js";
import { courseModel } from "./schema.js";
import { client, connectRedis } from "../../utils/configs/redis/index.js";
import {
  cloudinary,
  cloud_config,
} from "../../utils/configs/cloudinary-config/index.js";
import { userModel } from "../user/user-schema.js";

class CourseService {
  async find({
    page,
    limit,
    search,
    // featured,
    category,
    id,
    sort,
    level,
    courseType,
  }) {
    await connectRedis();

    const skip = (page - 1) * limit;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (category) {
      query.category = category;
    }
    if (id) {
      query.createdBy = new mongoose.Types.ObjectId(id);
    }
    if (level) {
      query.level = level;
    }

    if (courseType) {
      query[`courseType.type`] = courseType;
    }

    console.log("query", query);

    const cacheKey = `courses:page=${page}&limit=${limit}&search=${search || ""}
    &category=${category || ""}`;

    const cachedData = await client.get(cacheKey);

    if (cachedData) {
      console.log("Data served from Redis cache");
      return JSON.parse(cachedData);
    }

    const result = await courseModel.aggregate(
      dbQueries.paginationQuery(
        query,
        "courses",
        skip,
        limit,
        page,
        "institutes",
        true,
        "createdBy",
        "after",
        { createdAt: sort }
      )
    );

    await client.set(cacheKey, JSON.stringify(result), "EX", 60 * 60 * 24);

    return result;
  }

  async findOwn({
    page,
    limit,
    search,
    params,
    featured,
    category,
    hasQuery = false,
    queries = {},
  }) {
    if (!hasQuery) {
      const skip = (page - 1) * limit;
      console.log(params, page, limit);

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

      // const cacheKey = `courses:page=${page}&limit=${limit}&search=${search || ""}&featured=${featured || ""}&category=${category || ""}`;
      // const dataGet = await client.get(cacheKey);
      // console.log("dataa=>>>", dataGet);

      // if (dataGet) {
      //   console.log("Data from redis===>", dataGet);

      //   return JSON.parse(dataGet);
      // }
      console.log("query", query);

      const getCourse = await courseModel.aggregate(
        dbQueries.paginationQuery(query, "courses", skip, limit, page)
      );

      // await client.set(cacheKey, JSON.stringify(getCourse), "EX", 60 * 60 * 24);
      console.log(getCourse);

      return getCourse;
    } else {
      console.log(queries);

      const getCourse = await courseModel.find(queries);
      return getCourse;
    }
  }

  async findOne(query) {
    return await courseModel.findOne(query).populate("createdBy");
  }

  // ** CREATE COURSES ** /
  async create({ createdBy, body, user }) {
    await connectRedis();
    await client.del(`courses:*`);
    let extractLimit = user?.institute_sub_details?.planLimit || 0;

    if (extractLimit >= 1) {
      extractLimit -= 1;
      await userModel.findByIdAndUpdate(user._id, {
        $set: { "institute_sub_details.planLimit": extractLimit },
      });
    }
    return await courseModel.create({ ...body, createdBy });
  }
  // ** END ** /

  async update({ id, body }) {
    return await courseModel.findByIdAndUpdate(id, body, { new: true });
  }

  async delete({ id }) {
    const res = await courseModel.findByIdAndDelete(id);
    if (!res) return null;

    cloud_config();

    const imageUrl = res.image;
    let publicId = imageUrl.split("/");
    publicId = publicId[publicId.length - 1].split(".")[0];
    console.log("Image=>>>>", publicId);

    await cloudinary.uploader.destroy(publicId);

    return res;
  }
}

export const courseService = new CourseService();
