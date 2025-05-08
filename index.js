import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDb from "./src/utils/db/db.js";
import authRoute from "./src/app/routes/auth-route/auth-routes.js";
import userRoute from "./src/app/routes/user-route/user-route.js";
import courseRoute from "./src/app/routes/course/index.js";
import instituteRoutes from "./src/app/routes/institute-route/index.js";
import studentRoute from "./src/app/routes/student/index.js";
import fileRoute from "./src/app/routes/upload-files/index.js";
import passport from "./src/utils/passport-utils/passport-util.js";
import session from "express-session";
import cron from "node-cron";
import { client } from "./src/utils/configs/redis/index.js";
const app = express();
const port = process.env.PORT;

app.use(cors("*"));
app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ extended: true, limit: "100mb" }));
app.use(
  session({
    name: "_ga",
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
app.use("/api", courseRoute);
app.use("/api", instituteRoutes);
app.use("/api", studentRoute);
app.use("/api", fileRoute);

cron.schedule("0 2 * * *", async () => {
  await client.flushDb();
  console.log("Redis cache cleared at 2 AM");
});

app.get("/", (req, res) => {
  res.send("Server is running on port " + port);
});

app.listen(port, () => console.log("Server running on port " + port));
