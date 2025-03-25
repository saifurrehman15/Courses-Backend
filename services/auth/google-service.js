import { userModel } from "../../db-models/user-schema.js";
import bcrypt from "bcrypt";
import token from "../../helper/token-generate.js";

const googleService = async (value) => {
  console.log(value.emails[0].value);

  const userExist = await userModel.findOne({ email: value.emails[0].value });

  let obj = {
    email: value.emails[0].value,
    password: "no-password",
    provider: "google",
  };

  console.log(userExist);

  if (!userExist) {
    let newUser = new userModel({ ...obj });
    newUser = await newUser.save();

    const { accessToken, refreshToken } = token(newUser);
    let objWithoutPass = newUser.toObject();
    delete objWithoutPass.password;

    return { user: objWithoutPass, accessToken, refreshToken };
  } else {
    const { accessToken, refreshToken } = token(userExist);
    console.log(token(userExist));
    
    let objWithoutPass = userExist.toObject();
    delete objWithoutPass.password;
console.log(accessToken);

    return { user: objWithoutPass, accessToken, refreshToken };
  }
};

export default googleService;
