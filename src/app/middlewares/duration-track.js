import sendResponse from "../helper/response-sender.js";
import { instituteModal } from "../institute/schema.js";
import { userModel } from "../user/user-schema.js";
import dayjs from "dayjs";
const trackDuration = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await userModel.findById(userId);
    const route = req.route.path;

    if (!user.institute.duration) {
      return next();
    }

    const { duration } = user.institute;

    const [durationNumber, inMYD] = duration.split(" ");

    if (!durationNumber || !inMYD) {
      return res.status(400).json({
        error: "Invalid duration format. It should be like `3 months`",
        status: 400,
      });
    }

    const parseDuration = Number(durationNumber);
    const inMYDLowerCase = inMYD.toLowerCase();
    const validUnits = ["month", "months", "year", "years"];

    if (!validUnits.includes(inMYDLowerCase)) {
      return res.status(400).json({
        error:
          "Invalid unit in duration. It should be like `3 months` or `1 year`",
        status: 400,
      });
    }

    const monthsAgo = dayjs().subtract(parseDuration, inMYDLowerCase);
    let daysLeft = dayjs().diff(monthsAgo, "days");

    if (daysLeft === 0) {
      await Promise.all([
        instituteModal.findByIdAndUpdate(user.institute, {
          status: "completed",
        }),
        userModel.findByIdAndUpdate(userId, {
          $unset: { institute: "" },
        }),
      ]);
      if (route.includes("application")) {
        return sendResponse(res, 200, {
          error: true,
          message: `You have successfully completed this course!`,
        });
      }
    } else {
      if (route.includes("application")) {
        return sendResponse(res, 403, {
          error: true,
          message: `You can apply after ${daysLeft} days!`,
        });
      }
    }

    next();
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "An error occurred while tracking the duration",
      status: 500,
    });
  }
};

export default trackDuration;
