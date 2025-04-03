import express from "express";
import { coursesController } from "../../courses/controller.js";
import authenticateUser from "../../middlewares/authenticate-user.js";

const router = express.Router();

router.get("/courses", coursesController.index)
router.post("/courses" , authenticateUser ,coursesController.create)
router.get("/courses/:id", coursesController.show)
router.put("/courses/:id",  authenticateUser,coursesController.update)
router.delete("/courses/:id", authenticateUser ,coursesController.delete)

export default router;