
import mongoose from "mongoose";
import sendResponse from "../../helper/response-sender.js";
import { courseModel } from "../schema.js";
import { courseItemModel } from "./schema.js";
import { validateSchema } from "./validate.js";

class CoursesItemsService {
    async find({ courseId, page, limit, search }) {
        const skip = (page - 1) * limit;
        const matchStage = search ? { $match: {
            course : new mongoose.Types.ObjectId(courseId),
            $or : [
                { title: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ]
        } } : {
            $match: {
                course: new mongoose.Types.ObjectId(courseId),
            }
        };
        return await courseItemModel.aggregate([
            matchStage,
            {
                $facet: {
                  metadata: [{ $count: "total" }],
                  data: [{ $skip: skip }, { $limit: limit }]
                }
              },
              {
                $project: {
                  courses_items: "$data",
                  pagination: {
                      total: { $arrayElemAt: ["$metadata.total", 0] },
                      page: { $literal: page },
                      limit: { $literal: limit },
                      totalPages: {
                        $ceil: {
                          $divide: [
                            { $arrayElemAt: ["$metadata.total", 0] },
                            limit
                          ]
                        }
                      }
                  }
                }
              }
        ]);
    }
}

export const courseItemsService = new CoursesItemsService();