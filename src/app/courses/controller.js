import sendResponse from "../helper/response-sender.js";
import { updateSchema, validateSchema } from "./validate.js";
import { courseService } from "./services.js";
class CoursesController {
  async index(req, res) {
    const {
      limit = 10,
      page = 1,
      search = "",
      featured = false,
      category = "",
      id = "",
      sort = -1,
      level = "",
    } = req.query;
    try {
<<<<<<< Updated upstream
      console.log(category,level);
=======
      console.log("Checking Data",category, courseType);
>>>>>>> Stashed changes

      const courses = await courseService.find({
        page,
        limit: Number(limit),
        search,
        featured,
        category,
        id,
        sort: Number(sort),
        level,
      });

      console.log(courses);

      return sendResponse(res, 200, {
        error: false,
        message: "Courses fetched successfully!",
        data: courses[0],
      });
    } catch (err) {
      return sendResponse(res, 500, {
        error: true,
        message: err.message || "Internal server error!",
      });
    }
  }

  async findOwn(req, res) {
    const {
      limit = 10,
      page = 1,
      search = "",
      featured = "",
      category = "",
    } = req.query;
    try {
      let user = req.user;
      let idsCheck = user?.institute?.instituteId || user?.owner;
      console.log(req.params.id, idsCheck);

      if (req.params.id !== idsCheck.toString()) {
        return sendResponse(res, 403, {
          error: true,
          message: "You don't have permission to access this course!",
          data: [],
        });
      }

      const courses = await courseService.findOwn({
        page: page,
        limit: Number(limit),
        search: search,
        params: req.params,
        featured,
        category,
      });

      return sendResponse(res, 200, {
        error: false,
        message: "Courses fetched successfully!",
        data: courses[0],
      });
    } catch (err) {
      return sendResponse(res, 500, {
        error: true,
        message: err.message || "Internal server error!",
      });
    }
  }

  async show(req, res) {
    try {
      const course = await courseService.findOne({ _id: req.params.id });
      if (!course) {
        return sendResponse(res, 404, { error: true, message: "course not " });
      }
      return sendResponse(res, 200, {
        error: false,
        message: "Course fetched successfully!",
        data: { course },
      });
    } catch (err) {
      return sendResponse(res, 500, {
        error: true,
        message: err.message || "Internal server error!",
      });
    }
  }

  async create(req, res) {
    try {
      const { error, value } = validateSchema.validate(req.body);
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
      if (error) {
        return sendResponse(res, 400, { error: true, message: error.message });
      }

      const course = await courseService.create({
        createdBy: req.user.owner,
        body: value,
      });

      if (!course) {
        return sendResponse(res, 403, {
          error: true,
          message: "Failed to create course!",
        });
      }
      return sendResponse(res, 201, {
        error: false,
        message: "Course created successfully!",
        data: { course },
      });
    } catch (err) {
      return sendResponse(res, 500, {
        error: true,
        message: err.message || "Internal server error!",
      });
    }
  }

  async update(req, res) {
    try {
      let { error, value } = updateSchema.validate(req.body);
      if (error) {
        return sendResponse(res, 400, { error: true, message: error.message });
      }
      const course = await courseService.update({
        id: req.params.id,
        body: value,
      });
      return sendResponse(res, 200, {
        error: false,
        message: "Course updated successfully!",
        data: { course },
      });
    } catch (err) {
      return sendResponse(res, 500, {
        error: true,
        message: err.message || "Internal server error!",
      });
    }
  }

  async delete(req, res) {
    try {
      const course = await courseService.delete({ id: req.params.id });
      return sendResponse(res, 200, {
        error: false,
        message: "Course deleted successfully!",
      });
    } catch (err) {
      return sendResponse(res, 500, {
        error: true,
        message: err.message || "Internal server error!",
      });
    }
  }
}

export const coursesController = new CoursesController();
