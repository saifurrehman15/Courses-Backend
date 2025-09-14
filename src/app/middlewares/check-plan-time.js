import dayjs from "dayjs";
import { userModel } from "../user/user-schema.js";

const checkPlanTime = async (req, res, next) => {
  try {
    const { user } = req;
    if (!user || !user.institute_sub_details) {
      return next();
    }

    const { billingCycle, purchaseTime } = user.institute_sub_details;

    if (!billingCycle || !purchaseTime) {
      return next();
    }

    // expiry calculate
    let expiryDate;
    if (billingCycle === "monthly") {
      expiryDate = dayjs(purchaseTime).add(1, "month");
    } else if (billingCycle === "yearly") {
      expiryDate = dayjs(purchaseTime).add(1, "year");
    }

    if (expiryDate && dayjs().isAfter(expiryDate)) {
      console.log("hjdsn");

      // await userModel.findByIdAndUpdate(user._id, {
      //   $unset: {
      //     "institute_sub_details.billingCycle": null,
      //     "institute_sub_details.stripePaymentId": null,
      //     "institute_sub_details.stripeSessionId": null,
      //     "institute_sub_details.purchaseTime": null,
      //     "institute_sub_details.orderId": null,
      //     "institute_sub_details.paymentStatus": null,
      //   },
      //   $set: {
      //     "institute_sub_details.plan": "Free",
      //     "institute_sub_details.planLimit": 0,
      //   },
      // });
    }

    next();
  } catch (err) {
    console.error("Error in checkPlanTime middleware:", err);
    next();
  }
};

export default checkPlanTime;
