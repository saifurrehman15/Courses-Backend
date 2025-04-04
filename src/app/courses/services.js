import sendResponse from "../helper/response-sender.js";
import { courseModel } from "./schema.js";
import { validateSchema } from "./validate.js";
class CourseService {
        async find() {
            return  await courseModel.find();
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