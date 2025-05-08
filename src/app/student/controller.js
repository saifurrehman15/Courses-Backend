import sendResponse from "../helper/response-sender.js";
import { studentServices } from "./services.js";
import { validateSchema, validateUpdate } from "./validate.js";

class StudentController {
  async create(req, res) {
    try {
      const { error, value } = validateSchema.validate(req.body);

      if (error) {
        return sendResponse(res, 401, {
          error: true,
          message: error.message,
        });
      }

      const service = await studentServices.create({ value, user: req.user });
      console.log("hello", service);

      if (service.error) {
        return sendResponse(res, service.status, {
          error: true,
          message: service.error,
        });
      }

      return sendResponse(res, 201, {
        error: false,
        message: "successfully applied to this institute!",
        data: { result: service },
      });
    } catch (error) {
      console.log(error);

      return sendResponse(res, 500, {
        error: true,
        message: "Internal server error!" || error,
      });
    }
  }

  async findAll(req, res) {
    try {
      const service = await studentServices.findAll(req.query, req.params);
      console.log(service);

      if (!service) {
        return sendResponse(res, 403, {
          error: true,
          message: "Failed to fetch applications!",
        });
      }

      return sendResponse(res, 200, {
        error: false,
        message: "Applications fetched successfully!",
        data: { ...service[0] },
      });
    } catch (error) {
      return sendResponse(res, 500, {
        error: true,
        message: error || "Internal server error!",
      });
    }
  }

  async findOne(req, res) {
    try {
      const service = await studentServices.findOne({ _id: req.params.id });

      if (!service) {
        return sendResponse(res, 404, {
          error: true,
          message: "Application not found!",
        });
      }

      return sendResponse(res, 200, {
        error: false,
        message: "Application fetched successfully!",
        data: { application: service },
      });
    } catch (error) {
      return sendResponse(res, 500, {
        error: false,
        message: error || "Internal server error!",
      });
    }
  }

  async findOwnApplication(req, res) {
    try {
      const service = await studentServices.findOwnApplication(req.params.id);

      if (!service) {
        return sendResponse(res, 404, {
          error: true,
          message: "Applications not found!",
        });
      }

      return sendResponse(res, 200, {
        error: false,
        message: "Applications fetched successfully!",
        data: { application: service },
      });
    } catch (error) {
      return sendResponse(res, 500, {
        error: false,
        message: error || "Internal server error!",
      });
    }
  }

  async update(req, res) {
    try {
      let { error, value } = validateUpdate.validate(req.body);
      console.log(value);
      if (error) {
        return sendResponse(res, 401, { error: true, message: error.message });
      }
      

      const service = await studentServices.update({
        id: req.params.id,
        value,
        user: req.user,
      });
      console.log(service);

      if (service.error) {
        return sendResponse(res, service.status, {
          error: true,
          message: service.error,
        });
      }

      return sendResponse(res, 200, {
        error: false,
        message: "Application updated successfully!",
        data: { application: service },
      });
    } catch (error) {
      return sendResponse(res, 500, {
        error: true,
        message: "Internal server error!" || error,
      });
    }
  }

  async delete(req, res) {
    try {
      const service = await studentServices.delete(req.params.id);

      if (!service) {
        return sendResponse(res, 401, {
          error: true,
          message: "Failed to delete application!",
        });
      }
      console.log(req.messageSend);

      return sendResponse(res, 200, {
        error: false,
        message: req.messageSend || "application successfully deleted!",
        data: { application: service },
      });
    } catch (error) {
      return sendResponse(res, 500, {
        error: true,
        message: error || "Internal server error!",
      });
    }
  }
}

export const studentController = new StudentController();
