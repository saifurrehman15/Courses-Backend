import dayjs from "dayjs";
import { courseService } from "../courses/services.js";
import { userModel } from "../user/user-schema.js";
import sendResponse from "../helper/response-sender.js";

const checkUserPlan = async (req, res, next) => {
  const { purchasedCourses } = req.user;
  const { id } = req.params;

  const findCourse = await courseService.findOne({ _id: id });
  if (findCourse) {
    const isPurchased = purchasedCourses.find(
      (c) => c?.courseId?.toString() === findCourse._id.toString()
    );
    if (findCourse?.courseType?.type === "premium") {
      if (!isPurchased) {
        return sendResponse(res, 403, {
          error: true,
          message: "You don't have access to this course!",
          redirect: true,
        });
      }
      console.log(isPurchased);
      const { billingCycle, purchaseTime } = isPurchased?.paymentDetails;
      let expiryDate;
      if (billingCycle === "monthly") {
        expiryDate = dayjs(purchaseTime).add(1, "month");
      } else if (billingCycle === "yearly") {
        expiryDate = dayjs(purchaseTime).add(1, "year");
      }

      if (dayjs().isAfter(expiryDate)) {
        await userModel.findByIdAndUpdate(req.user._id, {
          $pull: {
            purchasedCourses: {
              courseId: findCourse._id,
            },
          },
        });
      }
    }
  }

  next();
};

export default checkUserPlan;
