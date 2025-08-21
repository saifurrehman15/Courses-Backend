import Joi from "joi";
import sendResponse from "../helper/response-sender.js";
import { userServices } from "./user-service.js";
import Stripe from "stripe";
import { plans } from "../../utils/configs/plans/index.js";
import { userModel } from "./user-schema.js";
import { ordersService } from "../orders/services.js";
import { ordersModel } from "../orders/schema.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

class User {
  async findSingleUser(req, res) {
    try {
      let user = req.user;

      sendResponse(res, 200, {
        error: false,
        message: "User fetched successfully!",
        data: { user },
      });
    } catch (error) {
      sendResponse(res, 500, {
        error: true,
        message: error || "Internal server error!",
      });
    }
  }

  async updateUser(req, res) {
    try {
      const { user, body } = req;
      let updateUser = {};

      let validateUser = Joi.object({
        userName: Joi.string().min(3).optional(),
        bio: Joi.string()
          .optional()
          .allow("")
          .when(Joi.string().min(1), {
            then: Joi.string().min(10),
          }),
      });

      const { error, value } = validateUser.validate(body);
      console.log(error);

      if (error) {
        sendResponse(res, 401, { error: true, message: error.message });
      }

      if (value?.userName) {
        updateUser.userName = value?.userName;
      }

      if (value?.bio) {
        updateUser.bio = value?.bio;
      }

      if (!value?.userName && !value?.bio) {
        return sendResponse(res, 400, {
          error: true,
          message: "User Name or Bio should not be empty!",
        });
      }

      const isUpdated = await userServices.updateService(user?._id, value);

      if (isUpdated.error) {
        return sendResponse(res, 403, {
          error: true,
          message: isUpdated?.message,
        });
      }

      return sendResponse(res, 200, {
        error: false,
        message: "User updated successfully!",
        data: isUpdated,
      });
    } catch (error) {
      console.log(error);

      return sendResponse(res, 500, {
        error: true,
        message: error?.message || "Internal server error!",
      });
    }
  }

  async getPaymentDetails(req, res) {
    try {
      const { id } = req.params;
      console.log(id);

      const paymentIntent = await stripe.paymentIntents.retrieve(id, {
        expand: ["charges"],
      });

      if (!paymentIntent) {
        return sendResponse(res, 404, {
          error: true,
          message: "Error finding payment details!",
        });
      }

      const receiptUrl = await stripe.charges.retrieve(
        paymentIntent.latest_charge
      );

      return sendResponse(res, 200, {
        error: false,
        message: "Retrieve payment intent successfully!",
        data: { paymentIntent, receiptUrl: receiptUrl.receipt_url },
      });
    } catch (err) {
      console.error("Error fetching payment:", err);
      return sendResponse(res, 500, {
        error: true,
        message: err.message,
      });
    }
  }

  async planUpdate(req, res) {
    try {
      const { body, user } = req;
      const { amount, currency, billingCycle, plan, customerDetails } = body;

      // Create a PaymentIntent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount,
        currency: currency,
        receipt_email: customerDetails.email,
        metadata: {
          billing_cycle: billingCycle,
          plan: plan,
          userId: user._id.toString(),
          customer_name: `${customerDetails.firstName} ${customerDetails.lastName}`,
          customer_email: customerDetails.email,
        },
      });

      return sendResponse(res, 200, {
        data: paymentIntent.client_secret,
        message: "Client secret created successfully!",
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ error: error.message });
    }
  }

  async handleWebhook(req, res) {
    const sig = req.headers["stripe-signature"];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        "whsec_70c7121ad6bc097b1dd003016584b18d62e20f4edafa4768b559b090d65c2def"
      );
    } catch (err) {
      console.error("Webhook signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    try {
      switch (event.type) {
        case "payment_intent.succeeded":
          const paymentIntent = event.data.object;

          let order = await ordersModel.findOne({
            paymentIntentId: paymentIntent.id,
          });
          const orderDocs = await ordersModel.countDocuments();
          const orderId = `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}-${orderDocs + 1}`;

          if (!order) {
            order = await ordersService.createOrder({
              userId: paymentIntent.metadata.userId || null,
              paymentIntentId: paymentIntent.id,
              planBuy: paymentIntent.metadata.plan || "Unknown Plan",
              chargeId: paymentIntent.latest_charge,
              amount: paymentIntent.amount,
              orderId,
              currency: paymentIntent.currency,
              receiptEmail: paymentIntent.receipt_email,
              status: "succeeded",
            });
          } else {
            await ordersModel.findOneAndUpdate(
              { paymentIntentId: paymentIntent.id },
              {
                $set: {
                  paymentId: paymentIntent.id,
                  chargeId: paymentIntent.latest_charge,
                  status: "succeeded",
                },
              },
              { new: true }
            );
          }

          if (paymentIntent.metadata.userId) {
            const userId = paymentIntent.metadata.userId;
            await userModel.findByIdAndUpdate(userId, {
              $set: {
                "institute_sub_details.paymentStatus": "Paid",
                "institute_sub_details.plan": paymentIntent.metadata.plan || "",
                "institute_sub_details.planLimit":
                  plans[paymentIntent.metadata.plan]?.planLimit || 0,
                "institute_sub_details.orderId": orderId,
              },
            });
          }

          break;

        case "payment_intent.payment_failed":
          const failedIntent = event.data.object;
          await ordersModel.findOneAndUpdate(
            { paymentIntentId: failedIntent.id },
            { $set: { paymentId: failedIntent.id, status: "failed" } },
            { new: true }
          );
          break;

        default:
          console.log(`⚠️ Unhandled event type: ${event.type}`);
      }

      res.json({ received: true });
    } catch (err) {
      console.error("Error handling webhook:", err);
      res.status(500).send("Server error");
    }
  }
}

export const UserController = new User();
