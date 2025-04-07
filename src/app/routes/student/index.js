import express from "express";
import { studentController } from "../../student/controller";
import authenticateUser from "../../middlewares/authenticate-user";

const router = express.Router();

router.post("/student-application", authenticateUser, studentController.create);
