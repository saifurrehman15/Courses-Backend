import { userModel } from "../../db-models/user-schema.js";
import jwt from "jsonwebtoken";

const loginService = async (value) => {
  const userExist = await userModel.findOne({ email: value.email });

  if (!userExist) return null;

  let objWithoutPass = userExist.toObject();
  delete objWithoutPass.password;

  let accessToken = jwt.sign({ ...objWithoutPass }, process.env.AUTH_SECRET, {
    expiresIn: "2h",
  });

  let refreshToken = jwt.sign({ ...objWithoutPass }, process.env.AUTH_SECRET);

  return { user: objWithoutPass, accessToken, refreshToken };
};

export default loginService;
