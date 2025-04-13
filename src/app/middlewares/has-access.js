import sendResponse from "../helper/response-sender.js";
import { courseService } from "../courses/services.js";
import { instituteService } from "../institute/services.js";
import { studentServices } from "../student/services.js";

const hasAccess = async (req, res, next) => {
  const user = req.user;
  const route = req.route.path;

  try {
    if (route.includes("course")) {
      const course = await courseService.findById({ id: req.params.id });
      if (course.user.toString() === user._id.toString()) {
        next();
      } else {
        sendResponse(res, 400, {
          error: true,
          message: "You don't have access to this course!",
        });
      }
    }

    // institute
    if (route.includes("institute")) {
      const institute = await instituteService.findOne({
        _id: req.params.id,
        createdBy: user._id,
      });

      if (institute) {
        next();
      } else {
        sendResponse(res, 400, {
          error: true,
          message: "You don't have access to this institute!",
        });
      }
    }

    // applications
    if (route.includes("application")) {
      const application = await studentServices.findOne({
        _id: req.params.id,
      });

      const { institute, appliedBy } = application.toObject();

      if (institute.toString() === user?.institute?.instituteId?.toString()) {
        req.messageSend =
          "The application was suspended by your institute!";
        return next();
      }

      if (appliedBy.toString() === user._id.toString()) {
        req.messageSend =
          "The application was successfully deleted by the user!";
        return next();
      }

      return sendResponse(res, 400, {
        error: true,
        message: "You don't have access to this application!",
      });
    }
  } catch (error) {
    sendResponse(res, 500, {
      error: true,
      message: "Internal server error!",
    });
  }
};

export default hasAccess;
