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

    const [durationNumber, inMYD] = institute
      .toObject()
      .duration.trim()
      .split(" ");

    let parseDuration = Number(durationNumber);
    let inMYDLowerCase = inMYD.toLowerCase();

    const validUnits = ["months", "month", "year", "years"];

    if (!validUnits.includes(inMYDLowerCase)) {
      return {
        error: "Invalid unit in duration.It should like `3 months`",
        status: 400,
      };
    }
    const alreadyStudying = user?.institute?.admissionAt;
    console.log(alreadyStudying);

    const monthsAgo = dayjs().subtract(parseDuration, inMYDLowerCase);
    let daysLeft = dayjs().diff(monthsAgo, "days");

    const condition1 =
      alreadyApplied && dayjs(user?.institute?.admissionAt).isBefore(monthsAgo);

    const condition2 =
      alreadyApplied?.status == "pending" &&
      value.institute !== alreadyApplied?.institute.toString();

    const condition3 =
      alreadyApplied && value.institute == alreadyApplied?.institute.toString();

    if (user?.institute && !condition1) {
      return { error: `You can apply after ${daysLeft} days!`, status: 403 };
    }

    if (!alreadyApplied || condition1 || condition2) {
      return await studentModal.create({ ...value, appliedBy: user._id });
    } else if (condition3) {
      return {
        error: `You have already applied to this institute please wait until they approve your application!`,
        status: 400,
      };
    }
  }

  async findAll(queries) {
    const { search, limits = 5, page = 1 } = queries;
    let limitsInNumber = Number(limits);
    let skipsOffset = (page - 1) * limitsInNumber;

    let query = {};
    console.log("search", queries.search);

    if (search) {
      query = {
        $or: [
          {
            instituteName: { $regex: queries.search, $options: "i" },
          },
          { instituteAddress: { $regex: queries.search, $options: "i" } },
        ],
      };
    }

    return await studentModal.aggregate(
      dbQueries.paginationQuery(
        query,
        "applications",
        skipsOffset,
        limitsInNumber,
        page
      )
    );
  }

  async findOne(id) {
    return await studentModal.findById(id);
  }

  async findOwnApplication(id) {
    return await studentModal.find({ appliedBy: id });
  }

  async update({ id, value, user }) {
    
      const updated = await studentModal
  .findByIdAndUpdate(id, value, { new: true })
  


    console.log(updated);

    if (!updated) {
      return { error: "Student application not found", status: 404 };
    }

    await studentModal.updateMany(
      {
        appliedBy: user._id,
        status: "pending",
      },
      { $set: { status: "expired" } }
    );
    
    let data = await userModel.findByIdAndUpdate(user._id, {
      $set: {
        institute: {
          instituteId: updated.institute,
          duration: updated.status,
        },
      },
    });
    console.log(data);

    return updated;
  }

  async delete(id) {
    return studentModal.findByIdAndDelete(id);
  }
}

export const studentServices = new StudentService();
