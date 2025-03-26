import { userModel } from "../../db-models/user-schema.js";
import bcrypt from "bcryptjs";
import token from "../../helper/token-generate.js";

const registerService = async (value) => {
  const userExist = await userModel.findOne({ email: value.email });

  if (userExist) return null;

  let hashedPassword = await bcrypt.hash(value.password, 10);
  value.password = hashedPassword;
  value.provider = "credientials";

  let newUser = new userModel({ ...value });
  newUser = await newUser.save();

  let objWithoutPass = newUser.toObject();
  delete objWithoutPass.password;

  const { accessToken, refreshToken } = token(objWithoutPass);

  return { user: objWithoutPass, accessToken, refreshToken };
};

export default registerService;
