import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDb from "./src/utils/db/db.js";
import authRoute from "./src/app/routes/auth-route/auth-routes.js";
import userRoute from "./src/app/routes/user-route/user-route.js";
import passport from "./src/utils/passport-utils/passport-util.js";
import session from 'express-session';

const app = express();
const port = process.env.PORT;

app.use(cors("*"));
app.use(express.json());


app.use(
  session({
    name:"_ga",
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

app.get("/", (req, res) => {
  res.send("Server is running on port " + port);
});

app.listen(port, () => console.log("Server running on port " + port));
