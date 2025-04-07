import { userModel } from "../user/user-schema.js";
import sendResponse from "../helper/response-sender.js";
import jwt from "jsonwebtoken";

const c = async (req, res, next) => {
  try {
    const tokenProvided = req.header("Authorization");

    if (!tokenProvided) {
      sendResponse(res, 400, {
        error: true,
        message: "Token is not provided!",
      });
    }

    const token = tokenProvided.replace("Bearer ", "");

    let decoded = jwt.verify(token, process.env.AUTH_SECRET);

    if (!decoded) {
      sendResponse(res, 403, { error: true, message: "Token is expired!" });
    }


    const findUser = await userModel.findById(decoded._id).lean();
    
    if (!findUser) {
      sendResponse(res, 404, { error: true, message: "User not found!" });
    }

    req.user = findUser;

    next();
  } catch (error) {

    sendResponse(res, 500, {
      error: true,
      message: error || "Internal server error!",
    });
  }
};

export default authenticateUser;
