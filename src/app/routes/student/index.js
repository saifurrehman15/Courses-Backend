import express from "express";
import { studentController } from "../../student/controller.js";
import authenticateUser from "../../middlewares/authenticate-user.js";
import hasAccess from "../../middlewares/has-access.js";

const router = express.Router();

router.post("/student-application", authenticateUser, studentController.create);
router.get("/all-application", authenticateUser, studentController.findAll);
router.get(
  "/single-application/:id",
  authenticateUser,
  studentController.findOne
);
router.get(
  "/student-applications/:id",
  authenticateUser,
  studentController.findOwnApplication
);
router.put(
  "/update-application/:id",
  [authenticateUser, hasAccess],
  studentController.findOne
);
router.delete(
  "/delete-application/:id",
  [authenticateUser, hasAccess],
  studentController.findOne
);

export default router;
