import express from "express";
import { studentController } from "../../student/controller.js";
import authenticateUser from "../../middlewares/authenticate-user.js";

const router = express.Router();

router.post("/student-application",authenticateUser, studentController.create);

export default router