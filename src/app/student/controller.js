import sendResponse from "../helper/response-sender.js";
import { studentServices } from "./services.js";
import { validateSchema } from "./validate.js";

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

      const service = await studentServices.create({ value, user: req.user });

      if (service.error) {
        sendResponse(res, 403, {
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
      sendResponse(res, 500, {
        error: false,
        message: "successfully applied to this institute!",
        data: { result: service },
      });
    }
  }

  async findAll(req, res) {}

  async findOne(req, res) {}

  async update(req, res) {}

  async delete(req, res) {}
}

export const studentController = new StudentController();
