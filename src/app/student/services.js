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

  async findAll() {}

  async findOne() {}

  async update() {}

  async delete() {}
}

export const studentServices = new StudentService();
