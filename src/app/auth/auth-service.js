import { userModel } from "../user/user-schema.js";
import bcrypt from "bcryptjs";
import token from "../helper/token-generate.js";
import generateOTP from "../helper/otp_generate.js";
import { transporter } from "../../utils/node-mailer-config/index.js";
import { otpModel } from "./otp-schema.js";
import dayjs from "dayjs";

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
    return { error: "User is not found with this email!", status: 404 };
  }

  let otp = generateOTP();

  const info = await transporter.sendMail({
    from: "Saif ki Shadi ki Appeal ❤️ <saifrizwankhan786@gmail.com>",
    to: checkUser.email,
    subject: "Zindagi ka naya safar shuru karne ki darkhwast 💍",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #333;">Mummy, meri ek choti si request hai...</h2>
        <p>Dear ${checkUser.email.split("@")[0].replace(/\./g, "") || "meri mummy"},</p>
        <p>Jab se hosh sambhala hai, ek hi khwaab dekha hai... shaadi ka 😅</p>
        <p>Ab waqt aa gaya hai ke aap meri is choti si khushi ko pura karein.</p>
        <p>Iss safar ki shuruaat ke liye niche diya gaya OTP use karein:</p>
        <h1 style="background: #f2f2f2; padding: 10px 20px; display: inline-block; border-radius: 5px; color: #333;">
          <strong>${otp}</strong>
        </h1>
        <p>OTP sirf 10 minutes ke liye valid hai. Kisi aur ko batana mana hai 🙊</p>
        <p>Agar aapne yeh request nahi ki, toh mummy please mujhe maaf kardein 🙈</p>
        <br />
        <p>Hamesha aapka beta,<br />Saif 💕</p>
      </div>
    `,
  });
  

  console.log("Message sent:", info.messageId);

  if (!info) {
    return { error: error.message, status: 403 };
  }
  let hashed = await bcrypt.hash(otp, 10);
  let checkOtp = await otpModel.findOne({
    email: value.email,
    isExpire: false,
  });

  if (checkOtp) {
    await otpModel.findOneAndUpdate(
      { email: value.email },
      { isExpire: true },
      { $new: true }
    );
  }
  
  await otpModel.create({ otp: hashed, email: value.email });

  return info;
};

const verifyOtpService = async (value) => {
  const findOtpCode = await otpModel.findOne({
    email: value.email,
    isExpire: false,
  });

  if (!findOtpCode) {
    return { error: "otp is expired", status: 404 };
  }

  const createdAt = dayjs(findOtpCode.createdAt);
  const diff = dayjs().diff(createdAt, "minute");
  console.log(diff);

  if (diff > 10) {
    console.log("hy");

    await otpModel.findOneAndUpdate(
      { email: value.email },
      { isExpire: true },
      { $new: true }
    );

    return { error: "otp is expired!", status: 403 };
  }

  const correctOtp = await bcrypt.compare(value.otp, findOtpCode.otp);

  if (correctOtp) {
    await otpModel.findOneAndUpdate({ otp: value.otp }, { isExpired: true });
    return true;
  } else {
    return { error: "otp not matched!", status: 401 };
  }
};

export {
  registerService,
  loginService,
  googleService,
  forgetPasswordService,
  verifyOtpService,
};
