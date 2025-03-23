import express from "express";
import { authenticateUser } from "../../middlewares/authenticate-user.js";
import findSingleUser from "../../controllers/users/single-user-controller.js";

const router = express.Router();

router.get("/single-user", authenticateUser, findSingleUser);

export default router;
