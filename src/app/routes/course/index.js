import express from "express";
import { coursesController } from "../../courses/controller.js";
import authenticateUser from "../../middlewares/authenticate-user.js";
import hasAccess from "../../middlewares/has-access.js";
import courseListController from "../../courses/categories/controller.js";
import { planTrack } from "../../middlewares/plan-track.js";
import { coursesItemsController } from "../../courses/course-chapters/controller.js";
import { categoryController } from "../../courses/course-syllabus/controller.js";
import checkUserPlan from "../../middlewares/check-user-plan.js";

const router = express.Router();

// courses routes

router.post(
  "/courses",
  [authenticateUser, hasAccess, planTrack],
  coursesController.create
);
router.get("/courses", coursesController.index);
router.get(
  "/courses/:id",
  [authenticateUser, checkUserPlan],
  coursesController.show
);
router.get(
  "/courses-single/:id",
  coursesController.show
);
router.get(
  "/institute-courses/:id",
  authenticateUser,
  coursesController.findOwn
);
router.put(
  "/courses/:id",
  [authenticateUser, hasAccess],
  coursesController.update
);
router.delete(
  "/courses/:id",
  [authenticateUser, hasAccess],
  coursesController.delete
);

// courses categories routes
router.post(
  "/courses/category",
  [authenticateUser, hasAccess, planTrack],
  categoryController.create
);
router.get(
  "/courses/category/:id",
  [authenticateUser, hasAccess],
  categoryController.findAll
);
router.get(
  "/courses/single-category/:id",
  [authenticateUser, hasAccess],
  categoryController.findOne
);

router.put(
  "/courses/category/:id",
  [authenticateUser, hasAccess],
  categoryController.update
);
router.delete(
  "/courses/category/:id",
  [authenticateUser, hasAccess],
  categoryController.delete
);

// ** CATEGORY ROUTES ** //
router.post(
  "/create-category",
  [authenticateUser, hasAccess],
  courseListController.create
);
router.get("/categories", courseListController.getAll);
router.put(
  "/update-category",
  [authenticateUser, hasAccess],
  courseListController.update
);
router.delete(
  "/delete-category/:id",
  [authenticateUser, hasAccess],
  courseListController.delete
);
// ** END CATEGORY ROUTES ** //

// ** CHAPTERS ROUTES ** //
router.post(
  "/courses/items",
  [authenticateUser, hasAccess, planTrack],
  coursesItemsController.create
);
router.get("/courses/items/:id", coursesItemsController.index);
router.get("/courses/single-items/:id", coursesItemsController.show);
router.put(
  "/courses/update-items/:id",
  [authenticateUser, hasAccess],
  coursesItemsController.update
);
router.delete(
  "/courses/delete-items/:id",
  [authenticateUser, hasAccess],
  coursesItemsController.delete
);
// ** END CHAPTERS ROUTES ** //

export default router;
