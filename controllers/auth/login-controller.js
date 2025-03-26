import sendResponse from "../../helper/response-sender.js";
import loginService from "../../services/auth/login.js";
import { validateSchema } from "../../utils/validation-schemas/auth/user-validate.js";

const login = async (req, res) => {

  console.log('login')


  const { error, value } = validateSchema.validate(req.body);
console.log(req,res);

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

export default login;
