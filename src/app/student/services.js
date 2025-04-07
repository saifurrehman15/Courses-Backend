import { studentModal } from "./schema";

class StudentService {
  async create({ value, user }) {
    let alreadyApplied = await studentModal.findOne({ appliedBy: user._id });
    if (alreadyApplied) {
      return null;
    }
    return await studentModal.create({ ...value, appliedBy: user._id });
  }

  async findAll() {}

  async findOne() {}

  async update() {}

  async delete() {}
}

export const studentServices = new StudentService();
