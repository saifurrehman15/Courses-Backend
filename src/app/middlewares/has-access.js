import sendResponse from "../helper/response-sender.js";
import { instituteService } from "../institute/services.js";
import { studentServices } from "../student/services.js";
import { categoryServices } from "../courses/course-items/services.js";
import { courseItemModel } from "../courses/course-materials/schema.js";
import { courseService } from "../courses/services.js";

const hasAccess = async (req, res, next) => {
  const user = req.user;
  const route = req.route.path;
  const method = req.method;
  const isInstituteOwner = user?.owner;
  const isAdmin = user?.role === "admin";
  const isReadOperation = method !== "POST";

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
      const category = await categoryServices.findOne({ _id: req.params.id });

      if (!category && isReadOperation) {
        return sendResponse(res, 404, {
          error: true,
          message: "Course category not found!",
        });
      }

      const hasAccess = isReadOperation
        ? category?.institute.toString() === isInstituteOwner.toString()
        : true;

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
        ? course?.createdBy.toString() === isInstituteOwner.toString()
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
