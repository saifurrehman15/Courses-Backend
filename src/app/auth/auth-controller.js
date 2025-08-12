import sendResponse from "../helper/response-sender.js";
import {
  loginService,
  registerService,
  googleService,
  forgetPasswordService,
  verifyOtpService,
  changePasswordService,
} from "./auth-service.js";

import { loginSchema, validateSchema } from "../user/user-validate.js";
import token from "../helper/token-generate.js";
import Joi from "joi";

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
  const { error, value } = loginSchema.validate(req.body);
console.log(error,req.body);

  if (error) {
    sendResponse(res, 400, { error: true, message: error.message });
  }

  const loginServiceGet = await loginService(value);

  if (loginServiceGet.error) {
    sendResponse(res, loginServiceGet.status, {
      error: true,
      message: loginServiceGet.error,
    });
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

const forgetPasswordController = async (req, res) => {
  try {
    const validation = Joi.object({
      email: Joi.string().email().required(),
    });

    console.log("hello");

    const { error, value } = validation.validate(req.body);

    if (error) {
      return sendResponse(res, 400, { error: true, message: error.message });
    }

    const service = await forgetPasswordService(value);

    if (service.error) {
      return sendResponse(res, service.status, {
        error: true,
        message: service.error,
      });
    }

    return sendResponse(res, 200, {
      error: false,
      message: "Otp sent successfully!",
      data: { get: service },
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, {
      error: true,
      message: error || "Internal server error!",
    });
  }
};

const verifyOtpController = async (req, res) => {
  try {
    const service = await verifyOtpService(req.body);
    console.log(service);

    if (service.error) {
      return sendResponse(res, service.status, {
        error: true,
        message: service.error,
      });
    }

    if (service) {
      return sendResponse(res, 200, {
        success: true,
        redirectTo: "/change-password",
      });
    }
  } catch (error) {
    console.error(error);
    return sendResponse(res, 500, {
      error: true,
      message: error || "Internal server error!",
    });
  }
};

const changePassword = async (req, res) => {
  try {
    let validatePass = Joi.object({
      password: Joi.string().length(6).required(),
      email: Joi.string().email().required(),
    });
    console.log("hy", req.body);

    const { error, value } = validatePass.validate(req.body);

    if (error) {
      return sendResponse(res, 400, { error: true, message: error.message });
    }

    const service = await changePasswordService(value);
    console.log("service", service);

    if (service?.error) {
      return sendResponse(res, service.status, {
        error: true,
        message: service.error,
      });
    }

    return sendResponse(res, service.status, {
      error: true,
      message: "successfully changed password!",
      redirect: service.path,
    });
  } catch (error) {
    console.error(error);
    return sendResponse(res, service.status, {
      error: true,
      message: "Internal server error!",
    });
  }
};

export {
  signUp,
  login,
  googleAuthenticate,
  logOut,
  refereshToken,
  forgetPasswordController,
  verifyOtpController,
  changePassword,
};
