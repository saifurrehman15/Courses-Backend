import sendResponse from "../helper/response-sender.js";
import {
  loginService,
  registerService,
  googleService,
} from "./auth-service.js";

import { validateSchema } from "../user/user-validate.js";
import token from "../helper/token-generate.js";

// register controller
const signUp = async (req, res) => {
  try {
    const { error, value } = validateSchema.validate(req.body);

    if (error) {
      sendResponse(res, 400, { error: true, message: error.message });
    }

    const obj = await registerService(value);

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

  const { error, value } = validateSchema.validate(req.body);

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


    const obj = await googleService(req.user);

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

  let getToken = token(req.user);
  let { accessToken, refreshToken } = getToken;

  if (!req.user) {
    sendResponse(res, 403, { error: true, message: "Failed to get token!" });
  }

  sendResponse(res, 200, {
    error: false,
    message: "Token successfully refreshed",
    data: { accessToken, refreshToken },
  });
};

export { signUp, login, googleAuthenticate, logOut, refereshToken };
