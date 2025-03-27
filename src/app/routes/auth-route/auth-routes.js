import express from "express";
import passport from "../../../utils/passport-utils/passport-util.js";

import {
  signUp,
  login,
  googleAuthenticate,
  logOut,
} from "../../auth/auth-controller.js";

const router = express.Router();

// register
router.post("/register", signUp);

// login
router.post("/login", login);

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

export default router;
