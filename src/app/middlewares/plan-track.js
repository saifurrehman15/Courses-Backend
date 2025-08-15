import mongoose from "mongoose";
import { syllabusPlansModel } from "../courses/syllabus-plans.js";
import sendResponse from "../helper/response-sender.js";
import { chaptersPlansModel } from "../courses/chapters-plans.js";

export const planTrack = async (req, res, next) => {
  try {
    const { user } = req;
    const route = req.route.path;
    const instituteSubDetails = user?.institute_sub_details;
    const method = req.method;
    let textShow;

    if (method === "POST") {
      textShow = "create more";
    } else if (method === "PUT") {
      textShow = "update";
    } else {
      textShow = "delete";
    }

    const checkingValidate = async (
      subjective = "subjects",
      limitText = "syllabusLimit",
      plansModel = syllabusPlansModel
    ) => {
      let syllLimit = await plansModel
        .findOne({
          courseId: new mongoose.Types.ObjectId(req.body?.course),
          instituteId: req.body.institute,
        })
        .select(limitText);

      if (!syllLimit) {
        return next();
      }

      if (syllLimit?.[limitText] >= 1) {
        syllLimit = syllLimit?.[limitText] - 1;
        req.limitCount = syllLimit;
        return next();
      }

      if (syllLimit?.[limitText] < 1) {
        return sendResponse(res, 403, {
          error: true,
          message: `You need to upgrade your plan to ${textShow} ${subjective}!`,
        });
      } else {
        return next();
      }
    };

    if (route.includes("items")) {
      return checkingValidate("chapters", "chaptersLimit", chaptersPlansModel);
    }

    if (route.includes("category")) {
      return checkingValidate();
    }

    if (route.includes("courses")) {
      const planLimit = instituteSubDetails?.planLimit;

      if (planLimit < 1) {
        return sendResponse(res, 403, {
          error: true,
          message: `You need to upgrade your plan to ${textShow}!`,
        });
      }
    }

    return next();
  } catch (err) {
    console.error("planTrack middleware error:", err);
    return sendResponse(res, 500, {
      error: true,
      message: "Internal server error in plan check.",
    });
  }
};
