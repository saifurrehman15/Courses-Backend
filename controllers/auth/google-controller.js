import sendResponse from "../../helper/response-sender.js";
import registerService from "../../services/auth/register.js";

const googleAuthenticate = async (req, res) => {
  try {
    if (!req.user) {
      sendResponse(res, 401, { error: true, message: "Authentication failed" });
    }

    console.log(req.user);
    
    // const obj = registerService(req.user);

    req.session.user = req.user;
    res.redirect("http://localhost:4200/");
  } catch (error) {
    sendResponse(res, 500, {
      error: true,
      message: error || "Internal server error",
    });
  }
};

const logOut = async (req, res) => {
  res.clearCookie("connect.sid");
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      return res.status(500).send("Logout failed");
    }
    console.log("Session destroyed");
    res.redirect("http://localhost:4200/");
  });
};



export { googleAuthenticate, logOut };
