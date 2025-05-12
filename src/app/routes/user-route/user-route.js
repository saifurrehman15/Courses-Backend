import express from "express";
import findSingleUser from "../../user/user-controller.js";
import authenticateUser from "../../middlewares/authenticate-user.js";
import trackDuration from "../../middlewares/duration-track.js";

const router = express.Router();

router.get("/single-user", [authenticateUser], findSingleUser);

export default router;
