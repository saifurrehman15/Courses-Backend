import express from "express";
import upload from "../../../utils/configs/multer-config/index.js";
import { fileController } from "../../files/controller.js";
import authenticateUser from "../../middlewares/authenticate-user.js";

const router = express.Router();

router.post("/upload-file", [upload.single("file")], fileController.uploadFile);

export default router;
