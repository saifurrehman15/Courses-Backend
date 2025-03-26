import sendResponse from "../../helper/response-sender.js";
import registerService from "../../services/auth/register.js";
import { validateSchema } from "../../utils/validation-schemas/auth/user-validate.js";

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

export default signUp;
