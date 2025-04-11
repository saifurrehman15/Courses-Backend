import sendResponse from "../helper/response-sender.js";
import { studentServices } from "./services.js";
import { validateSchema, validateUpdate } from "./validate.js";

class StudentController {
  async create(req, res) {
    try {
      const { error, value } = validateSchema.validate(req.body);

      if (error) {
        sendResponse(res, 401, {
          error: true,
          message: error.message,
        });
      }
      console.log(req.body, req.user);

      const service = await studentServices.create({ value, user: req.user });
      console.log("hello", service);

      if (service.error) {
        sendResponse(res, service.status, {
          error: true,
          message: service.error,
        });
      }

      sendResponse(res, 201, {
        error: false,
        message: "successfully applied to this institute!",
        data: { result: service },
      });
    } catch (error) {
      console.log(error);

      sendResponse(res, 500, {
        error: true,
        message: "Internal server error!" || error,
      });
    }
  }

  async findAll(req, res) {
    try {
      const service = await studentServices.findAll(req.query);
      if (!service) {
        sendResponse(res, 403, {
          error: true,
          message: "Failed to fetch applications!",
        });
      }

      sendResponse(res, 200, {
        error: false,
        message: "Applications fetched successfully!",
        data: { ...service[0] },
      });
    } catch (error) {
      sendResponse(res, 500, {
        error: true,
        message: error || "Internal server error!",
      });
    }
  }

  async findOne(req, res) {
    try {
      const service = await studentServices.findOne(req.params.id);

      if (!service) {
        sendResponse(res, 404, {
          error: true,
          message: "Application not found!",
        });
      }

      sendResponse(res, 200, {
        error: false,
        message: "Application fetched successfully!",
        data: { application: service },
      });
    } catch (error) {
      sendResponse(res, 500, {
        error: false,
        message: error || "Internal server error!",
      });
    }
  }

  async findOwnApplication(req, res) {
    try {
      const service = await studentServices.findOwnApplication(req.params.id);

      if (!service) {
        sendResponse(res, 404, {
          error: true,
          message: "Applications not found!",
        });
      }

      sendResponse(res, 200, {
        error: false,
        message: "Applications fetched successfully!",
        data: { application: service },
      });
    } catch (error) {
      sendResponse(res, 500, {
        error: false,
        message: error || "Internal server error!",
      });
    }
  }

  async update(req, res) {
    try {
      let { error, value } = validateUpdate.validate(req.body);

      if (error) {
        sendResponse(res, 401, { error: true, message: error.message });
      }

      const service = await studentServices.update({
        id: req.params.id,
        value,
        user: req.user,
      });
      console.log(req.params.id,service);

      if (!service) {
        sendResponse(res, 401, {
          error: true,
          message: "Failed to update application!",
        });
      }

      sendResponse(res, 200, {
        error: false,
        message: "Application updated successfully!",
        data: { application: service },
      });
    } catch (error) {
      sendResponse(res, 500, {
        error: true,
        message: "Internal server error!" || error,
      });
    }
  }

  async delete(req, res) {
    try {
      const service = await studentServices.delete(req.params.id);

      if (!service) {
        sendResponse(res, 401, {
          error: true,
          message: "Failed to delete application!",
        });
      }

      sendResponse(res, 200, {
        error: false,
        message: "Application deleted successfully!",
        data: { application: service },
      });
    } catch (error) {
      sendResponse(res, 500, {
        error: true,
        message: error || "Internal server error!",
      });
    }
  }
}

export const studentController = new StudentController();
