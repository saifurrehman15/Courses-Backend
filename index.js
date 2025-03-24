import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDb from "./utils/db/db.js";
import authRoute from "./routes/auth-route/auth-routes.js";
import userRoute from "./routes/user-route/user-route.js";
import passport from "./utils/passport-utils/passport-util.js";
import googleRoute from "./routes/auth-route/passport-routes.js"
import session from 'express-session';

const app = express();
const port = process.env.PORT;

app.use(cors("*"));
app.use(express.json());


app.use(
  session({
    secret: process.env.AUTH_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Database connection 
connectDb();

app.use("/api", authRoute);
app.use("/api", userRoute);
app.use("/api", googleRoute);

app.get("/", (req, res) => {
  res.send("Server is running on port " + port);
});

app.listen(port, () => console.log("Server running on port " + port));
