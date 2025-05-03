import express from "express";
import { coursesController } from "../../courses/controller.js";
import authenticateUser from "../../middlewares/authenticate-user.js";
import hasAccess from "../../middlewares/has-access.js";

import { coursesItemsController } from "../../courses/course-materials/controller.js";
import { categoryController } from "../../courses/course-items/controller.js";
import categoryListController from "../../courses/categories/controller.js";


const router = express.Router();

// courses routes

router.post("/courses" , [authenticateUser,hasAccess] , coursesController.create);
router.get("/courses", coursesController.index);
router.get("/courses/:id", coursesController.show);
router.get("/institute-courses/:id",authenticateUser, coursesController.findOwn);
router.put("/courses/:id",  [authenticateUser, hasAccess ], coursesController.update);
router.delete("/courses/:id", [authenticateUser, hasAccess ] , coursesController.delete);

// courses categories routes
router.post("/courses/category",[authenticateUser,hasAccess],categoryController.create);
router.get("/courses/category/:id",categoryController.findAll);
router.get("/courses/single-category/:id",categoryController.findOne);
router.put("/courses/category/:id",[authenticateUser,hasAccess],categoryController.update);
router.delete("/courses/category/:id",[authenticateUser,hasAccess],categoryController.delete);


// category 
router.post("/create-category",[authenticateUser,hasAccess], categoryListController.create);
router.get("/categories", categoryListController.getAll);
router.put("/update-category",[authenticateUser,hasAccess], categoryListController.update);
router.delete("/delete-category/:id",[authenticateUser,hasAccess], categoryListController.delete);


// courses items routes
router.post("/courses/items", [authenticateUser,hasAccess], coursesItemsController.create);
router.get("/courses/items/:id", coursesItemsController.index);
router.get("/courses/single-items/:id", coursesItemsController.show);
router.put("/courses/:id/items/:id", [ authenticateUser, hasAccess ], coursesItemsController.update);
router.delete("/courses/:id/items/:id", [ authenticateUser, hasAccess ], coursesItemsController.delete);


export default router;