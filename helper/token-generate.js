import jwt from "jsonwebtoken";

const token = async (objForToken) => {
  let accessToken = jwt.sign({ ...objForToken }, process.env.AUTH_SECRET, {
    expiresIn: "2h",
  });

  let refreshToken = jwt.sign({ ...objForToken }, process.env.AUTH_SECRET);
console.log("func",accessToken,refreshToken);

  return { accessToken, refreshToken };
};

export default token;
