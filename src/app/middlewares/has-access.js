import sendResponse from "../helper/response-sender.js";
import { instituteService } from "../institute/services.js";
import { studentServices } from "../student/services.js";
import { categoryServices } from "../courses/course-syllabus/services.js";
import { courseItemModel } from "../courses/course-chapters/schema.js";
import { courseService } from "../courses/services.js";
import { courseModel } from "../courses/schema.js";
import mongoose from "mongoose";

const hasAccess = async (req, res, next) => {
  const user = req.user;
  const route = req.route.path;
  const method = req.method;
  const isInstituteOwner = user?.owner;
  const isAdmin = user?.role === "admin";
  const isReadOperation = method !== "POST";
// console.log(user,isInstituteOwner);

  try {
    const institute = await instituteService.findOne({ _id: isInstituteOwner });

    if (route.includes("items")) {
      const item = await courseItemModel.findOne({ _id: req.params.id });

      if (!item && isReadOperation) {
        return sendResponse(res, 404, {
          error: true,
          message: "Course item not found!",
        });
      }

      const hasAccess = isReadOperation
        ? item?.institute.toString() === isInstituteOwner.toString()
        : true;

      if ((institute && institute.approvedByAdmin && hasAccess) || isAdmin) {
        return next();
      } else {
        return sendResponse(res, 403, {
          error: true,
          message: "Access denied to course item.",
        });
      }
    }

    if (route.includes("category")) {
      const paramId = req?.params?.id;
      const query = {
        $or: [{ _id: paramId }, { course: paramId }, { institute: paramId }],
      };
      console.log(req.params.id,query,req.body.course);
      
      const category = await categoryServices.findOne(query);
      let categoryHasCourse = await courseModel.findOne({
        _id: new mongoose.Types.ObjectId(req.body.course),
      });

      if (!categoryHasCourse && !isReadOperation) {
        return sendResponse(res, 404, {
          error: true,
          message: "Their is no course available on that id!",
        });
      }

      if (!category && isReadOperation) {
        return sendResponse(res, 404, {
          error: true,
          message: "Course category not found!",
        });
      }
      // console.log("instituteOwner",isInstituteOwner);

      const hasAccess = isReadOperation
        ? category?.institute?.toString() === isInstituteOwner?.toString() ||
          category?.institute.toString() ===
            user?.institute?.instituteId.toString()
        : isInstituteOwner
          ? req.body.institute === isInstituteOwner.toString()
          : false;

      if ((institute && institute.approvedByAdmin && hasAccess) || isAdmin) {
        return next();
      } else {
        return sendResponse(res, 403, {
          error: true,
          message: "Access denied to course category.",
        });
      }
    }

    if (route.includes("courses")) {
      const course = await courseService.findOne({ _id: req.params.id });

      if (!course && isReadOperation) {
        return sendResponse(res, 404, {
          error: true,
          message: "Course not found!",
        });
      }

      const hasAccess = isReadOperation
        ? course.toObject()?.createdBy._id.toString() ===
          isInstituteOwner.toString()
        : true;

      if ((institute && institute.approvedByAdmin && hasAccess) || isAdmin) {
        return next();
      } else {
        return sendResponse(res, 403, {
          error: true,
          message: "Access denied to course.",
        });
      }
    }

    if (route.includes("institute")) {
      if (method !== "POST") {
        const hasAccess =
          (institute &&
            institute.approvedByAdmin &&
            req.params.id === isInstituteOwner) ||
          isAdmin;

        if (hasAccess) {
          return next();
        } else {
          return sendResponse(res, 403, {
            error: true,
            message: "Access denied to institute.",
          });
        }
      } else {
        if ((institute && institute.approvedByAdmin) || isAdmin) {
          return next();
        } else {
          return sendResponse(res, 403, {
            error: true,
            message: "Access denied to create institute.",
          });
        }
      }
    }

    if (route.includes("application")) {
      if (method !== "POST") {
        const application = await studentServices.findOne({
          _id: req.params.id,
        });

        if (!application) {
          return sendResponse(res, 404, {
            error: true,
            message: "Application not found!",
          });
        }

        const hasAccess =
          application?.institute.toString() === isInstituteOwner.toString();

        if ((institute && institute.approvedByAdmin && hasAccess) || isAdmin) {
          return next();
        } else {
          return sendResponse(res, 403, {
            error: true,
            message: "Access denied to application.",
          });
        }
      } else {
        return next();
      }
    }

    if (route.includes("categories")) {
      if (isAdmin) {
        return next();
      } else {
        return sendResponse(res, 403, {
          error: true,
          message:
            "Only admin have access to create, update and delete categories!",
        });
      }
    }

    return next();
  } catch (error) {
    console.error("Access control error:", error);
    return sendResponse(res, 500, {
      error: true,
      message: "Internal server error!",
    });
  }
};

export default hasAccess;
