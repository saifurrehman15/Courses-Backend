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
import Stripe from "stripe";
const app = express();
const port = process.env.PORT;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json({ limit: "100mb" }));
app.use(express.urlencoded({ limit: "100mb", extended: true }));

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

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, billingCycle, plan, customerDetails } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
      metadata: {
        billing_cycle: billingCycle,
        plan: plan,
        customer_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
        customer_email: customerDetails.email
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => console.log("Server running on port " + port));
