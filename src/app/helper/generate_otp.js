
const generateOTP = () => {
  let otp = "";
  let specialCharacters = process.env.OTP_CHARACTERS;

  for (let i = 0; i < 6; i++) {
    let random = Math.floor(Math.random() * specialCharacters.length);
    otp += specialCharacters[random];
  }

  return otp;
};

export default generateOTP;
