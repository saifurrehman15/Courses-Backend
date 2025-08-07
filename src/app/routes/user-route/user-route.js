import express from "express";
import { UserController } from "../../user/user-controller.js";
import authenticateUser from "../../middlewares/authenticate-user.js";
import trackDuration from "../../middlewares/duration-track.js";

const router = express.Router();

router.get("/single-user", [authenticateUser], UserController.findSingleUser);
router.post("/update-user", [authenticateUser], UserController.updateUser);

export default router;
