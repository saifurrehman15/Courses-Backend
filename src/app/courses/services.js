import sendResponse from "../helper/response-sender.js";
import { courseModel } from "./schema.js";
import { validateSchema } from "./validate.js";
class CourseService {

        async find({ page, limit, search }) {
            const skip = (page - 1) * limit;
            const matchStage = search ? { $match: {
                $or : [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } },
                ]
            } } : {
                $match: {}
            };
            return  await courseModel.aggregate([
                matchStage,
                {
                    $facet: {
                      metadata: [{ $count: "total" }],
                      data: [{ $skip: skip }, { $limit: limit }]
                    }
                  },
                  {
                    $project: {
                      courses: "$data",
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
            ])

        }
        async findById({id}) {
            return await courseModel.findById(id);
        }
        async create({user, body}) {                           
                const { error, value } = validateSchema.validate(body); 
                if (error) {
                    sendResponse(res, 400, { error: true, message: error.message });
                }
                return await courseModel.create({...value, user: user._id});
        }
        async update({id, body}) {
            let { error, value } = validateSchema.validate(body); 
            if (error) {
                sendResponse(res, 400, { error: true, message: error.message });
            }
            return await courseModel.findByIdAndUpdate(id, value, { new: true });
        }
        async delete({id}) {
             await courseModel.findByIdAndDelete(id);
        }

}

export const courseService = new CourseService();