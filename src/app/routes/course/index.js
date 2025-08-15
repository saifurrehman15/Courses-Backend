import express from "express";
import { coursesController } from "../../courses/controller.js";
import authenticateUser from "../../middlewares/authenticate-user.js";
import hasAccess from "../../middlewares/has-access.js";

import { coursesItemsController } from "../../courses/course-materials/controller.js";
import { categoryController } from "../../courses/course-items/controller.js";
import courseListController from "../../courses/categories/controller.js";


const router = express.Router();

// courses routes

router.post("/courses" , [authenticateUser,hasAccess] , coursesController.create);
router.get("/courses", coursesController.index);
router.get("/courses/:id", coursesController.show);
<<<<<<< Updated upstream
router.get("/institute-courses/:id",authenticateUser, coursesController.findOwn);
router.put("/courses/:id",  [authenticateUser, hasAccess ], coursesController.update);
router.delete("/courses/:id", [authenticateUser, hasAccess ] , coursesController.delete);

// courses categories routes
router.post("/courses/category",[authenticateUser,hasAccess],categoryController.create);
router.get("/courses/category/:id",[authenticateUser,hasAccess],categoryController.findAll);
router.get("/courses/single-category/:id",[authenticateUser,hasAccess],categoryController.findOne);
router.put("/courses/category/:id",[authenticateUser,hasAccess],categoryController.update);
router.delete("/courses/category/:id",[authenticateUser,hasAccess],categoryController.delete);
=======
router.get(
  "/institute-courses/:id",
  authenticateUser,
  coursesController.findOwn
);
router.put(
  "/courses/:id",
  [authenticateUser, hasAccess, planTrack],
  coursesController.update
);
router.delete(
  "/courses/:id",
  [authenticateUser, hasAccess],
  coursesController.delete
);

// courses categories routes
router.post(
  "/courses/category",
  [authenticateUser, hasAccess, planTrack],
  categoryController.create
);
router.get(
  "/courses/category/:id",
  [authenticateUser, hasAccess],
  categoryController.findAll
);
router.get(
  "/courses/single-category/:id",
  [authenticateUser, hasAccess],
  categoryController.findOne
);
router.put(
  "/courses/category/:id",
  [authenticateUser, hasAccess],
  categoryController.update
);
router.delete(
  "/courses/category/:id",
  [authenticateUser, hasAccess],
  categoryController.delete
);
>>>>>>> Stashed changes


// category 
router.post("/create-category",[authenticateUser,hasAccess], courseListController.create);
router.get("/categories", courseListController.getAll);
router.put("/update-category",[authenticateUser,hasAccess], courseListController.update);
router.delete("/delete-category/:id",[authenticateUser,hasAccess], courseListController.delete);


// courses items routes
<<<<<<< Updated upstream
router.post("/courses/items", [authenticateUser,hasAccess], coursesItemsController.create);
=======
router.post(
  "/courses/items",
  [authenticateUser, hasAccess, planTrack],
  coursesItemsController.create
);
>>>>>>> Stashed changes
router.get("/courses/items/:id", coursesItemsController.index);
router.get("/courses/single-items/:id", coursesItemsController.show);
router.put("/courses/update-items/:id", [ authenticateUser, hasAccess ], coursesItemsController.update);
router.delete("/courses/delete-items/:id", [ authenticateUser, hasAccess ], coursesItemsController.delete);


export default router;