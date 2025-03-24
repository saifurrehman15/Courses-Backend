import express from "express";
import passport from "../../utils/passport-utils/passport-util.js";
import {
  googleAuthenticate,
  logOut,
} from "../../controllers/auth/google-controller.js";

const router = express.Router();

router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  googleAuthenticate
);

// router.get("/auth/session", (req, res) => {
//   if (req.session.user) {
//     res.json({ user: req.session.user });
//   } else {
//     res.status(401).json({ message: "No active session" });
//   }
// });

router.get("/auth/logout", logOut);

export default router;
