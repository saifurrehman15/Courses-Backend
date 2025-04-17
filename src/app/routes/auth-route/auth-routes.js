import express from "express";
import passport from "../../../utils/passport-utils/passport-util.js";
import authenticateUser from "../../middlewares/authenticate-user.js";

import {
  signUp,
  login,
  googleAuthenticate,
  logOut,
  refereshToken,
  forgetPasswordController,
  verifyOtpController,
  
} from "../../auth/auth-controller.js";

const router = express.Router();


// register
router.post("/register", signUp);

// login
router.post("/login", login);

// forget password
router.post("/forget-password", forgetPasswordController);

// verify otp
router.post("/verify-otp",verifyOtpController)

// google login
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// google callback
router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  googleAuthenticate
);

// google logout
router.get("/auth/logout", logOut);

// referesh token
router.get("/referesh-token", authenticateUser, refereshToken);

export default router;
