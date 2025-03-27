import sendResponse from "../helper/response-sender.js";

const findSingleUser = async (req, res) => {
  try {
    let user = req.user;

    sendResponse(res, 200, {
      error: false,
      message: "User fetched successfully!",
      data: { user },
    });
  } catch (error) {
    console.log("Hy");

    sendResponse(res, 500, {
      error: true,
      message: error || "Internal server error!",
    });
  }
};

export default findSingleUser;
