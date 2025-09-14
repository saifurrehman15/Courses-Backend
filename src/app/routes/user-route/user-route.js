import express from "express";
import { UserController } from "../../user/user-controller.js";
import authenticateUser from "../../middlewares/authenticate-user.js";
import checkPlanTime from "../../middlewares/check-plan-time.js";

const router = express.Router();

router.get("/single-user", [authenticateUser], UserController.findSingleUser);
router.put("/update-user", [authenticateUser], UserController.updateUser);
router.post("/create-payment-intent", authenticateUser, UserController.planUpdate);
router.get("/get-payment-intent/:id", authenticateUser, UserController.getPaymentDetails);


export default router;
