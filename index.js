import express from "express";
import cors from "cors";
import "dotenv/config.js";
import connectDb from "./utils/db/db.js";
import authRoute from "./routes/auth-route/auth-routes.js";
import userRoute from "./routes/user-route/user-route.js";

const app = express();
const port = process.env.PORT;

app.use(cors("*"));
app.use(express.json());

// db connection \\
connectDb();

// routes
app.use("/api", authRoute);
app.use("/api", authRoute);
app.use("/api", userRoute);

app.get("/", (req, res) => {
  res.send("Server is running on port " + port);
});

app.listen(port, () => console.log("Server running on port " + port));
