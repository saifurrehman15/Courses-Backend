import mongoose from "mongoose";

const { Schema } = mongoose;

const OrdersSchema = new Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "users", required: true },
    planBuy: { type: String, required: true },
    paymentIntentId: { type: String, required: true },
    chargeId: { type: String },
    orderId: { type: String, unique: true, required: true },
    status: {
      type: String,
      enum: ["pending", "succeeded", "failed", "refunded"],
      default: "pending",
    },
    amount: { type: Number, required: true },
    currency: { type: String, default: "usd" },
    receiptEmail: { type: String },
  },
  { timestamps: true }
);

export const ordersModel =
  mongoose.models.orders || mongoose.model("orders", OrdersSchema);
