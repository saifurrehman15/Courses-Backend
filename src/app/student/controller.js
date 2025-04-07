import sendResponse from "../helper/response-sender";
import { studentServices } from "./services";
import { validateSchema } from "./validate";

class StudentController {
  async create(req, res) {
    const { error, value } = validateSchema.validate(req.body);

    if (error) {
      sendResponse(res, 401, {
        error: true,
        message: error.message,
      });
    }

    const service = await studentServices.create({ value, user: req.user });
  }

  async findAll(req, res) {}

  async findOne(req, res) {}

  async update(req, res) {}

  async delete(req, res) {}
}

export const studentController = new StudentController();
