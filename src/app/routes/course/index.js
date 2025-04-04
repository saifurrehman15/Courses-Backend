import express from "express";
import { coursesController } from "../../courses/controller.js";
import authenticateUser from "../../middlewares/authenticate-user.js";
import hasAccess from "../../middlewares/has-access.js";
import expressListEndpoints from 'express-list-endpoints';
import { coursesItemsController } from "../../courses/items/controller.js";


const router = express.Router();

router.get("/courses", coursesController.index)
router.post("/courses" , authenticateUser ,coursesController.create)
router.get("/courses/:id", coursesController.show)
router.put("/courses/:id",  [authenticateUser, hasAccess ],coursesController.update)
router.delete("/courses/:id", [authenticateUser, hasAccess ] ,coursesController.delete)


router.get("/courses/:id/items", coursesItemsController.index)

router.post("/courses/:id/items", [ authenticateUser, hasAccess ], coursesItemsController.create)
router.get("/courses/:id/items/:id", coursesItemsController.show)
router.put("/courses/:id/items/:id", [ authenticateUser, hasAccess ], coursesItemsController.update)
router.delete("/courses/:id/items/:id", [ authenticateUser, hasAccess ], coursesItemsController.delete)




export default router;