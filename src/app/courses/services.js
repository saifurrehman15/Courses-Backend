import mongoose from "mongoose";
import { dbQueries } from "../../utils/db/queries.js";
import { courseModel } from "./schema.js";
import { client, connectRedis } from "../../utils/configs/redis/index.js";
import {
  cloudinary,
  cloud_config,
} from "../../utils/configs/cloudinary-config/index.js";

class CourseService {
  async find({ page, limit, search, featured, category }) {
    await connectRedis();

    const skip = (page - 1) * limit;
    let query = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    if (featured) {
      query.featured = JSON.parse(featured);
    }

    if (category) {
      query.category = category;
    }

    // const cacheKey = `courses:page=${page}&limit=${limit}&search=${search || ""}&featured=${featured || ""}&category=${category || ""}`;

    //   const cachedData = await client.get(cacheKey);

    //   if (cachedData) {
    //     console.log("Data served from Redis cache");
    //     return JSON.parse(cachedData);
    //   }

    const result = await courseModel.aggregate(
      dbQueries.paginationQuery(
        query,
        "courses",
        skip,
        limit,
        page,
        "institutes",
        true,
        "createdBy"
      )
    );

    console.log(result);

    // await client.set(cacheKey, JSON.stringify(result), "EX", 60 * 60 * 24);

    return result;
  }

  async findOwn({ page, limit, search, params, featured, category }) {
    const skip = (page - 1) * limit;
    console.log(params);

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

    const getCourse = await courseModel.aggregate(
      dbQueries.paginationQuery(query, "courses", skip, limit, page)
    );

    // await client.set(cacheKey, JSON.stringify(getCourse), "EX", 60 * 60 * 24);

    return getCourse;
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
