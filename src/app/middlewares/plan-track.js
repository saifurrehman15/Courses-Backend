import sendResponse from "../helper/response-sender.js";

export const planTrack = async (req, res, next) => {
  try {
    const { user } = req;
    const planLimit = user?.institute_sub_details?.planLimit;

    if (planLimit < 1) {
      return sendResponse(res, 403, {
        error: true,
        message: "You need to upgrade your plan to create more courses!",
      });
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
