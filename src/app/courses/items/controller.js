import sendResponse from "../../helper/response-sender.js";
import { courseModel } from "../schema.js";
import { courseItemModel } from "./schema.js";
import { validateSchema } from "./validate.js";


class CoursesItemsController  {

    async index(req, res) {
        try {
          const courseId = req.params.id;
          const courseExists = await courseModel.findById(courseId);
          console.log("courseId=>", courseExists);
          if (!courseExists) {
            return sendResponse(res, 404, {
              error: true,
              message: "Course not found!",
            });
          } 
          const courseItems = await courseItemModel.find({ course: courseId });
          sendResponse(res, 200, {
            error: false,
            message: "Course items fetched successfully!",
            data: { courseExists, courseItems },
          });
        } catch (err) {
          sendResponse(res, 500, {
            error: true,
            message: err.message || "Internal server error!",
          });
        }
      }

      async create(req, res) {
        try {

            const courseId = req.params.id;
            const courseExists = await courseModel.findById(courseId);
            if (!courseExists) {
                    return sendResponse(res, 404, {
                    error: true,
                    message: "Course not found!",
                });
            }
            const { error, value } = validateSchema.validate(req.body);
            if (error) {
                sendResponse(res, 400, { error: true, message: error.message });
            }
            const courseItem = await courseItemModel.create({...value, course: courseId});
            sendResponse(res, 201, {
                error: false,
                message: "Course item created successfully!",
                data: { courseItem },
            });
            } catch (err) {
            sendResponse(res, 500, {
                error: true,
                message: err.message || "Internal server error!",
            });
            }
      }
}

export const coursesItemsController = new CoursesItemsController(); 
