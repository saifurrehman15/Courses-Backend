import { userModel } from "../user/user-schema.js";
import bcrypt from "bcryptjs";
import token from "../helper/token-generate.js";
import generateOTP from "../helper/otp_generate.js";
import { transporter } from "../../utils/configs/node-mailer-config/index.js";
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

  if (!userExist) return { error: "user is not exist!", status: 404 };

  let checkPassword;

  if (userExist.provider !== "google") {
    checkPassword = await bcrypt.compare(value.password, userExist.password);
    if (!checkPassword) return { error: "Invalid credientials!", status: 400 };
  }

  let objWithoutPass = userExist.toObject();

  const { accessToken, refreshToken } = token({
    _id: objWithoutPass._id,
    email: objWithoutPass.email,
  });

  return { user: objWithoutPass, accessToken, refreshToken };
};

// google service
const googleService = async (value) => {
  const userExist = await userModel.findOne({ email: value.emails[0].value });
  console.log(userExist, value.emails[0].value);

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
    from: "Edu Master Support <saifrizwankhan786@gmail.com>",
    to: checkUser.email,
    subject: "Reset Your Password - OTP Inside",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${checkUser.email.split("@")[0].replace(/\./g, "") || "there"},</p>
        <p>We received a request to reset your password for your Edu Master account.</p>
        <p>Please use the following One-Time Password (OTP) to proceed:</p>
        <h1 style="background: #f2f2f2; padding: 10px 20px; display: inline-block; border-radius: 5px; color: #333;">
          <strong>${otp}</strong>
        </h1>
        <p>This OTP is valid for 10 minutes. Do not share it with anyone.</p>
        <p>If you did not request this, please ignore this email or contact our support.</p>
        <br />
        <p>Best regards,<br />The Acme Team</p>
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

    await otpModel.findOneAndDelete({ email: value.email });

    return { error: "otp is expired!", status: 403 };
  }

  const correctOtp = await bcrypt.compare(value.otp, findOtpCode.otp);

  if (correctOtp) {
    console.log("hy");

    await otpModel.findOneAndDelete({ email: value.email });
    return true;
  } else {
    return { error: "otp not matched!", status: 401 };
  }
};

const changePasswordService = async (value) => {
  const changed = await userModel.findOne({ email: value.email });
  if (!changed) {
    return { error: "No user found with this email!", status: 404 };
  }

  const hashed = await bcrypt.hash(value.password, 10);

  let updated = await userModel.findByIdAndUpdate(
    changed._id,
    { password: hashed },
    { new: true }
  );
  if (updated) {
    return { path: "password-changed/", status: 200 };
  } else {
    return { error: "Failed to changed password!", status: 403 };
  }
};

export {
  registerService,
  loginService,
  googleService,
  forgetPasswordService,
  verifyOtpService,
  changePasswordService,
};
