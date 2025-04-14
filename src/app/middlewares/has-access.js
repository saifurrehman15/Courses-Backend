import sendResponse from "../helper/response-sender.js";
import { courseService } from "../courses/services.js";
import { instituteService } from "../institute/services.js";
import { studentServices } from "../student/services.js";
import { categoryServices } from "../courses/items-category/services.js";
import e from "express";

const hasAccess = async (req, res, next) => {
  const user = req.user;
  const route = req.route.path;
  const method = req.method;
  const isInstituteOwner = user?.owner;
  const isAdmin = user?.role;

  const institute = await instituteService.findOne({
    _id: isInstituteOwner,
  });

  console.log(req.method);

  try {
    if (route.includes("category")) {
      if (method !== "POST") {
        const category = await categoryServices.findOne({ _id: req.params.id });
        if (!category) {
          return sendResponse(res, 404, {
            error: true,
            message: "Course category is not found!",
          });
        }

        if (isInstituteOwner || user.role === "admin") {
          return next();
        } else {
          return sendResponse(res, 400, {
            error: true,
            message: "You don't have access to this course!",
          });
        }
      } else {
        if (!institute) {
          return sendResponse(res, 403, {
            error: true,
            message: "You are owned any Institute yet!",
          });
        }

        if (!institute.approvedByAdmin) {
          return sendResponse(res, 403, {
            error: true,
            message:
              "Please wait until request will be accepted for registeration of institute!",
          });
        } else if (isAdmin || institute.approvedByAdmin) {
          return next();
        }
      }
    }

    if (route.includes("courses")) {
      if (method !== "POST") {
        if (isInstituteOwner || isAdmin) {
          return next();
        } else {
          return sendResponse(res, 400, {
            error: true,
            message: "You don't have access to this course!",
          });
        }
      } else {
        if (!institute) {
          return sendResponse(res, 404, {
            error: true,
            message: "You don't have access to this course!",
          });
        }

        if (!institute.approvedByAdmin) {
          return sendResponse(res, 403, {
            error: true,
            message:
              "Please wait until request will be accepted for registeration of institute!",
          });
        } else if (isAdmin || institute.approvedByAdmin) {
          return next();
        }
      }
    }

    // institute
    if (route.includes("institute")) {
      if (method !== "POST") {
        if (isInstituteOwner || isAdmin) {
          return next();
        } else {
          return sendResponse(res, 400, {
            error: true,
            message: "You don't have access to this institute!",
          });
        }
      } else {
        if (isInstituteOwner || isAdmin) {
          return next();
        } else {
          return sendResponse(res, 400, {
            error: true,
            message: "You don't have access to this institute!",
          });
        }
      }
    }

    // applications
    if (route.includes("application")) {
      if (method !== "POST") {
        const application = await studentServices.findOne({
          _id: req.params.id,
        });

        const { institute, appliedBy } = application.toObject();

        if (method === "DELETE") {
          if (
            institute.toString() === user?.institute?.instituteId?.toString()
          ) {
            req.messageSend =
              "The application was suspended by your institute!";
            return next();
          } else if (appliedBy.toString() === user._id.toString()) {
            req.messageSend =
              "The application was successfully deleted by the user!";
            return next();
          } else {
            return sendResponse(res, 400, {
              error: true,
              message: "You don't have access to this application!",
            });
          }
        } else {
          if (
            institute.toString() === isInstituteOwner ||
            user?.role === "admin"
          ) {
            return next();
          } else {
            return sendResponse(res, 400, {
              error: true,
              message: "You don't have access to this application!",
            });
          }
        }
      } else {
        if (isInstituteOwner || isAdmin) {
          return next();
        } else {
          return sendResponse(res, 400, {
            error: true,
            message: "You don't have access to this application!",
          });
        }
      }
    }
  } catch (error) {
    return sendResponse(res, 500, {
      error: true,
      message: "Internal server error!",
    });
  }
};

export default hasAccess;
