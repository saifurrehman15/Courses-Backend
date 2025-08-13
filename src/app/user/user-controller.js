import Joi from "joi";
import sendResponse from "../helper/response-sender.js";
import { userServices } from "./user-service.js";

class User {
  async findSingleUser(req, res) {
    try {
      let user = req.user;

      sendResponse(res, 200, {
        error: false,
        message: "User fetched successfully!",
        data: { user },
      });
    } catch (error) {
      sendResponse(res, 500, {
        error: true,
        message: error || "Internal server error!",
      });
    }
  }

  async updateUser(req, res) {
    try {
      const { user, body } = req;
      let updateUser = {};

console.log(body);

      let validateUser = Joi.object({
        userName: Joi.string().min(3).optional(),
        bio: Joi.string()
          .optional()
          .allow("")
          .when(Joi.string().min(1), {
            then: Joi.string().min(10),
          }),
      });

      const { error, value } = validateUser.validate(body);
      console.log(error);

      if (error) {
        sendResponse(res, 401, { error: true, message: error.message });
      }

      if (value?.userName) {
        updateUser.userName = value?.userName;
      }

      if (value?.bio) {
        updateUser.bio = value?.bio;
      }

      if (!value?.userName && !value?.bio) {
        return sendResponse(res, 400, {
          error: true,
          message: "User Name or Bio should not be empty!",
        });
      }

      const isUpdated = await userServices.updateService(user?._id, value);

      if (isUpdated.error) {
        return sendResponse(res, 403, {
          error: true,
          message: isUpdated?.message,
        });
      }

      return sendResponse(res, 200, {
        error: false,
        message: "User updated successfully!",
        data: isUpdated,
      });
    } catch (error) {
      console.log(error);

      return sendResponse(res, 500, {
        error: true,
        message: error?.message || "Internal server error!",
      });
    }
  }
}

export const UserController = new User();
