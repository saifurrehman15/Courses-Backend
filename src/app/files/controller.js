import sendResponse from "../helper/response-sender.js";
import { userServices } from "../user/user-service.js";
import { fileService } from "./service.js";

class Files {
  async uploadFile(req, res) {
    try {
      const { user, query } = req;
      const { isProfile = false } = query;
      // console.log("file from frontend!", req.file);
      const { file } = req;
      const fileName = file.originalname.split(".")[0];
      const mimetype = file.mimetype;
      let type;

      if (mimetype.startsWith("image/")) {
        type = "image";
      } else if (mimetype.startsWith("video/")) {
        type = "video";
      } else {
        type = "raw";
      }

      const uploading = await fileService.upload(req.file, fileName, type);

      if (!uploading) {
        return sendResponse(res, 403, {
          error: true,
          message: "Failed to upload file!",
        });
      }

      if (isProfile) {
        const uploadingProfile = await userServices.updateService(user._id, {
          profile: uploading.secure_url,
        });
        // console.log(uploadingProfile);

        if (!uploadingProfile) {
          return sendResponse(res, 403, {
            error: true,
            message: "Failed to update user profile avatar!",
          });
        }
      }

      return sendResponse(res, 200, {
        error: false,
        message: "File uploaded successfully!",
        data: { file: uploading.secure_url },
      });
    } catch (error) {
      console.error(error);
      return sendResponse(res, 500, {
        error: true,
        message: "Internal server error!",
      });
    }
  }
}

export const fileController = new Files();
