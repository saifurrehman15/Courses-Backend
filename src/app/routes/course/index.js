import express from "express";
import { coursesController } from "../../courses/controller.js";
import authenticateUser from "../../middlewares/authenticate-user.js";
import hasAccess from "../../middlewares/has-access.js";

import { coursesItemsController } from "../../courses/items/controller.js";
import { categoryController } from "../../courses/items-category/controller.js";


const router = express.Router();

// courses routes
router.get("/courses", coursesController.index)
router.post("/courses" , [authenticateUser,hasAccess] ,coursesController.create)
router.get("/courses/:id", coursesController.show)
router.put("/courses/:id",  [authenticateUser, hasAccess ],coursesController.update)
router.delete("/courses/:id", [authenticateUser, hasAccess ] ,coursesController.delete)

// courses categories routes
router.post("/courses/category",authenticateUser,categoryController.create);
router.get("/courses/category/:id",authenticateUser,categoryController.findAll);


// courses items routes
router.get("/courses/:id/items", coursesItemsController.index);
router.post("/courses/items", authenticateUser, coursesItemsController.create);
router.get("/courses/:id/items/:id", coursesItemsController.show);
router.put("/courses/:id/items/:id", [ authenticateUser, hasAccess ], coursesItemsController.update);
router.delete("/courses/:id/items/:id", [ authenticateUser, hasAccess ], coursesItemsController.delete);


export default router;