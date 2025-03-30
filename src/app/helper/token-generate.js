import jwt from "jsonwebtoken";

const token =  (objForToken) => {
  let accessToken = jwt.sign({ ...objForToken }, process.env.AUTH_SECRET, {
    expiresIn: "5s",
  });

  let refreshToken = jwt.sign({ ...objForToken }, process.env.AUTH_SECRET);

  return { accessToken, refreshToken };
};

export default token;
