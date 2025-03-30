import sendResponse from "../helper/response-sender.js";
import {
  loginService,
  registerService,
  googleService,
  refreshTokenService,
} from "./auth-service.js";

import { validateSchema } from "../user/user-validate.js";

// register controller
const signUp = async (req, res) => {
  try {
    const { error, value } = validateSchema.validate(req.body);

    if (error) {
      sendResponse(res, 400, { error: true, message: error.message });
    }

    const obj = await registerService(value);
    console.log(obj);

    if (!obj) {
      sendResponse(res, 403, { error: true, message: "User already exist!" });
    }

    sendResponse(res, 201, {
      error: false,
      message: "User registered successfully!",
      data: { ...obj },
    });
  } catch (error) {
    sendResponse(res, 500, {
      error: true,
      message: error || "Internal server error",
    });
  }
};

// login controller
const login = async (req, res) => {
  console.log("login");

  const { error, value } = validateSchema.validate(req.body);
  console.log(req, res);

  if (error) {
    sendResponse(res, 400, { error: true, message: error.message });
  }

  const loginServiceGet = await loginService(value);

  if (!loginServiceGet) {
    sendResponse(res, 404, { error: true, message: "The User is not exist!" });
  }

  sendResponse(res, 200, {
    error: false,
    message: "The user login successfully!",
    data: { ...loginServiceGet },
  });
};

// google controller
const googleAuthenticate = async (req, res) => {
  try {
    if (!req.user) {
      sendResponse(res, 401, { error: true, message: "Authentication failed" });
    }

    console.log(req.user);

    const obj = await googleService(req.user);
    console.log("req=>", obj);

    sendResponse(res, 201, {
      error: false,
      message: "User successfully login!",
      data: { ...obj },
    });
  } catch (error) {
    sendResponse(res, 500, {
      error: true,
      message: error || "Internal server error",
    });
  }
};

// google logout
const logOut = async (req, res) => {
  res.clearCookie("_ga");
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Logout failed");
    }
    console.log("Session destroyed");
    res.redirect("http://localhost:4200/");
  });
};

// referesh token

const refereshToken = (req, res) => {
  const { user } = req;

  const getToken = refreshTokenService(user);

  if (!getToken) {
    sendResponse(res, 403, { error: true, message: "Failed to get token!" });
  }

  sendResponse(res, 200, {
    error: false,
    message: "Token successfully refreshed",
    data:getToken,
  });
};

export { signUp, login, googleAuthenticate, logOut,refereshToken };
