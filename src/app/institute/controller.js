import sendResponse from "../helper/response-sender.js";
import { instituteService } from "./services.js";
import { validateInstitute, updateValidaation } from "./validate.js";

class InstituteController {
  async create(req, res) {
    try {
      const { error, value } = validateInstitute.validate(req.body);
      console.log(error, value);

      if (error) {
        sendResponse(res, 400, {
          error: true,
          message: error.message,
        });
      }

      const institute = await instituteService.create({
        body: value,
        user: req.user,
      });

      console.log(institute);

      if (!institute) {
        sendResponse(res, 403, {
          error: true,
          message: "You already have registered this institute on this cnic!",
        });
      }

      sendResponse(res, 201, {
        error: false,
        message: "Institute created successfully",
        data: { institute, user: req.user },
      });
    } catch (error) {
      sendResponse(res, 500, {
        error: true,
        message: error || "Internal server error",
      });
    }
  }

  async find(req, res) {
    try {
      const getAll = await instituteService.findAll(req.query);

      if (!getAll) {
        sendResponse(res, 403, {
          error: true,
          message: "Failed to fetch institutes!",
        });
      }

      sendResponse(res, 200, {
        error: false,
        message: "Institutes fetched successfully!",
        data: { ...getAll[0] },
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
      const institute = await instituteService.findOne({ _id: req.params.id });

      if (!institute) {
        return sendResponse(res, 404, {
          error: true,
          message: "Institute not found!",
        });
      }

      return sendResponse(res, 200, {
        error: false,
        message: "Institute fetched successfully!",
        data: { ...institute },
      });
    } catch (err) {
      return sendResponse(res, 200, {
        error: true,
        message: err,
      });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { error, value } = updateValidaation.validate(req.body);

      if (error) {
        return sendResponse(res, 401, {
          error: true,
          message: "Bad Request!" + error.message,
        });
      }

      const updated = await instituteService.updateDoc({ id, value });

      if (!updated) {
        return sendResponse(res, 403, {
          error: true,
          message: "Failed to update!",
        });
      }

      return sendResponse(res, 200, {
        error: false,
        message: "Institute updated successfully!",
        data: { ...updated },
      });
    } catch (err) {
      return sendResponse(res, 200, {
        error: true,
        message: err || "Internal server error!",
      });
    }
  }

  async delete(req, res) {
    try {
      const deleted = await instituteService.deleteDoc(req.params.id);

      if (!deleted) {
        return sendResponse(res, 403, {
          error: true,
          message: "Failed to delete institute!",
        });
      }
      return sendResponse(res, 200, {
        error: false,
        message: "Institute deleted successfully!",
      });
    } catch (err) {
      return sendResponse(res, 500, {
        error: true,
        message: err || "Internal server error!",
      });
    }
  }
}

export const instituteController = new InstituteController();
