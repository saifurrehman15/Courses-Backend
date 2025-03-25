import { userModel } from "../../db-models/user-schema.js";
import token from "../../helper/token-generate.js";

const loginService = async (value) => {
  const userExist = await userModel.findOne({ email: value.email });

  if (!userExist) return null;

  let objWithoutPass = userExist.toObject();
  delete objWithoutPass.password;

  const { accessToken, refreshToken } = token(objWithoutPass);

  return { user: objWithoutPass, accessToken, refreshToken };
};

export default loginService;
