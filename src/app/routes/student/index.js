import express from "express";
import { studentController } from "../../student/controller.js";
import authenticateUser from "../../middlewares/authenticate-user.js";
import hasAccess from "../../middlewares/has-access.js";
import trackDuration from "../../middlewares/duration-track.js";

const router = express.Router();

router.post("/student-application", [authenticateUser,trackDuration], studentController.create);
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
  authenticateUser,
  studentController.update
);
router.delete(
  "/delete-application/:id",
  [authenticateUser,hasAccess],
  studentController.delete
);

export default router;
