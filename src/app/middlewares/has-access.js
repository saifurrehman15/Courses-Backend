import { userModel } from "../user/user-schema.js";
import sendResponse from "../helper/response-sender.js";
import jwt from "jsonwebtoken";
import { setDriver } from "mongoose";
import { courseService } from "../courses/services.js";

const hasAccess = async (req, res, next) => {

    const user = req.user;
    const route = req.route.path;


    try {
        if (route.includes('course')) {
            const course = await courseService.findById({ id: req.params.id });
            if (course.user.toString() === user._id.toString()) {
                next();
            }else {
                sendResponse(res, 400, {
                    error: true,
                    message: "You don't have access to this course!"
                });
            } 
        }

        // institute    

        // if (route.includes('institute')) {
        //     const course = await courseModel.findById(req.params.id);
        //     if (course.user.toString() === user._id.toString()) {
        //         next();
        //     }else {
        //         sendResponse(res, 400, {
        //             error: true,
        //             message: "You don't have access to this course!"
        //         });
        //     } 
        // }
    } catch (error) {
        sendResponse(res, 500, {
            error: true,
            message: "Internal server error!"
        })
    }


};

export default hasAccess;
