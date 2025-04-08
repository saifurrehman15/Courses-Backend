import { dbQueries } from "../../utils/db/queries.js";
import { instituteModal } from "../institute/schema.js";
import { studentModal } from "./schema.js";
import dayjs from "dayjs";

class StudentService {
  async create({ value, user }) {
    let alreadyApplied = await studentModal.findOne({
      institute: value.institute,
      appliedBy: user._id,
      status: "pending",
    });

    let institute = await instituteModal.findOne({ _id: value.institute });

    institute = institute.toObject().duration.split(" ");

    let durationNumber = Number(institute[0]);
    let inMYD = institute[1].toLowerCase();

    const validUnits = ["months", "month", "year", "years"];

    if (!validUnits.includes(inMYD)) {
      return console.error("Invalid unit in duration.");
    }

    const monthsAgo = dayjs().subtract(durationNumber, inMYD);
    let daysLeft = dayjs().diff(monthsAgo, "days");

    if (
      (alreadyApplied?.createdAt &&
        dayjs(alreadyApplied.createdAt).isBefore(monthsAgo)) ||
      !alreadyApplied ||
      (alreadyApplied.status == "pending" &&
        alreadyApplied.institute.toString() &&
        value.institute !== alreadyApplied?.institute.toString())
    ) {
      return await studentModal.create({ ...value, appliedBy: user._id });
    } else {
      return { error: `You can apply after ${daysLeft} days!` };
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

  async update({ id, value }) {
    return studentModal.findByIdAndUpdate(id, value);
  }

  async delete(id) {
    return studentModal.findByIdAndDelete(id);
  }
}

export const studentServices = new StudentService();
