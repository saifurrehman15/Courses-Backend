import mongoose from "mongoose";
import { dbQueries } from "../../utils/db/queries.js";
import { instituteModal } from "../institute/schema.js";
import { userModel } from "../user/user-schema.js";
import { studentModal } from "./schema.js";
import dayjs from "dayjs";

class StudentService {
  async create({ value, user }) {
    let alreadyApplied = await studentModal.findOne({
      institute: value.institute,
      appliedBy: user._id,
    });

    let institute = await instituteModal.findOne({ _id: value.institute });
    if (!institute) {
      return { error: "The institute in which you are applying is not found!" };
    }

    if (user?.owner?.toString() === value.institute) {
      return {
        error: "You are not allowed to apply in your own institute!",
        status: 403,
      };
    }

    const condition2 =
      alreadyApplied?.status == "pending" &&
      value.institute !== alreadyApplied?.institute.toString();

    const condition3 =
      alreadyApplied && value.institute == alreadyApplied?.institute.toString();

    if (!alreadyApplied || condition2) {
      return await studentModal.create({ ...value, appliedBy: user._id });
    } else if (condition3) {
      return {
        error: `You have already applied to this institute please wait until they approve your application!`,
        status: 400,
      };
    }
  }

  async findAll(queries, params, queries2 = {}, hasQuery = false) {
    if (!hasQuery) {
      const { search, limits = 5, page = 1 } = queries;
      let limitsInNumber = Number(limits);
      let skipsOffset = (page - 1) * limitsInNumber;

      let query = {};
      console.log("search", queries.search);

      let $status = { $or: [{ status: "pending" }, { status: "approved" }] };
      if (search) {
        query = {
          $and: [
            {
              $or: [
                {
                  "appliedBy.userName": {
                    $regex: queries.search,
                    $options: "i",
                  },
                },
                { instituteAddress: { $regex: queries.search, $options: "i" } },
              ],
            },
            $status,
          ],
        };
      } else {
        query = $status;
      }

      query.institute = new mongoose.Types.ObjectId(params.id);

      return await studentModal.aggregate(
        dbQueries.paginationQuery(
          query,
          "applications",
          skipsOffset,
          limitsInNumber,
          page,
          "users",
          true,
          "appliedBy"
        )
      );
    } else {
      return await studentModal.find(queries2);
    }
  }

  async findOne(queries) {
    return await studentModal.findOne(queries);
  }

  async findOwnApplication(id) {
    return await studentModal.find({ appliedBy: id });
  }

  async update({ id, value }) {
    const findApplication = await studentModal.findById(id);

    if (!findApplication) {
      return { error: "Student application not found", status: 404 };
    } else if (findApplication.status === "expired") {
      return { error: "This application is expired!", status: 403 };
    }

    const updated = await studentModal.findByIdAndUpdate(
      id,
      { status: value.status },
      {
        new: true,
      }
    );

    if (updated.status === "approved") {
      await studentModal.updateMany(
        {
          appliedBy: updated.appliedBy,
          status: "pending",
        },
        { $set: { status: "expired" } }
      );
    }
    if (updated.status === "approved") {
      let data = await userModel.findByIdAndUpdate(
        updated.appliedBy,
        {
          $set: {
            institute: {
              duration: value.duration || "3 months",
              instituteId: updated.institute,
            },
          },
        },
        { new: true }
      );

      console.log("lorem ipsum", data);
    }

    return updated;
  }

  async delete(id) {
    const deleted = await studentModal.findByIdAndDelete(id);

    return deleted;
  }
}

export const studentServices = new StudentService();
