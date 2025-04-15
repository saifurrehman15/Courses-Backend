import { userModel } from "../user/user-schema.js";
import bcrypt from "bcryptjs";
import token from "../helper/token-generate.js";

// register service
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

// login service
const loginService = async (value) => {
  const userExist = await userModel.findOne({ email: value.email });

  if (!userExist) return null;

  let checkPassword;

  if (userExist.provider !== "google") {
    checkPassword = await bcrypt.compare(value.password, userExist.password);
    if (!checkPassword) return null;
  }

  let objWithoutPass = userExist.toObject();
  delete objWithoutPass.password;

  const { accessToken, refreshToken } = token(objWithoutPass);

  return { user: objWithoutPass, accessToken, refreshToken };
};

// google service
const googleService = async (value) => {
  const userExist = await userModel.findOne({ email: value.emails[0].value });

  let obj = {
    email: value.emails[0].value,
    provider: "google",
  };

  if (!userExist) {
    let newUser = new userModel({ ...obj });
    newUser = await newUser.save();

    const { accessToken, refreshToken } = token(newUser);
    let objWithoutPass = newUser.toObject();
    delete objWithoutPass.password;

    return { user: objWithoutPass, accessToken, refreshToken };
  } else {
    const { accessToken, refreshToken } = token(userExist);

    let objWithoutPass = userExist.toObject();
    delete objWithoutPass.password;

    return { user: objWithoutPass, accessToken, refreshToken };
  }
};

const forgetPasswordService = async (value) => {
  const checkUser = await userModel.findOne({ email: value.email });

  if (!checkUser) {
    return { error: "User not found with this email!", status: 404 };
  }

  return checkUser;
};

export { registerService, loginService, googleService };
