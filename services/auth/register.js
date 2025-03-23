import { userModel } from "../../db-models/user-schema.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const registerService = async (value) => {
  const userExist = await userModel.findOne({ email: value.email });

  if (userExist) return null;

  let hashedPassword = await bcrypt.hash(value.password, 10);
  value.password = hashedPassword;

  let newUser = new userModel({ ...value });
  newUser = await newUser.save();

  let objWithoutPass = newUser.toObject();
  delete objWithoutPass.password;

  let accessToken = jwt.sign({ ...objWithoutPass }, process.env.AUTH_SECRET, {
    expiresIn: "2h",
  });

  let refreshToken = jwt.sign({ ...objWithoutPass }, process.env.AUTH_SECRET);

  return { user: objWithoutPass, accessToken, refreshToken };
};

export default registerService;
