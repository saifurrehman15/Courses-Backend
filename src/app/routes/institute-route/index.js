import express from "express";
import { instituteController } from "../../institute/controller.js";
import authenticateUser from "../../middlewares/authenticate-user.js";
import hasAccess from "../../middlewares/has-access.js";

const router = express.Router();

router.post("/create-institute", [authenticateUser,hasAccess], instituteController.create);
router.get("/all-institute", authenticateUser, instituteController.find);
router.get("/single-institute/:id", instituteController.findOne);
router.put("/update-institute/:id", [authenticateUser,hasAccess], instituteController.update);
router.delete("/delete-institute/:id", [authenticateUser,hasAccess], instituteController.delete);


export default router;
