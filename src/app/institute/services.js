import { dbQueries } from "../../utils/db/queries.js";
import { instituteModal } from "./schema.js";

class InstituteServices {
  async create({ body, user }) {
    const findInstitute = await instituteModal({ cnic: body.cnic });

    if (findInstitute) return null;

    return await instituteModal.create({ ...body, createdBy: user._id });
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
    console.log(query);

    return await instituteModal.aggregate(
      dbQueries.paginationQuery(
        query,
        "institutes",
        skipsOffset,
        limitsInNumber,
        page
      )
    );
  }

  async findOne(query) {
    return instituteModal.findOne(query).lean();
  }

  async updateDoc({ id, value }) {
    return instituteModal.findByIdAndUpdate(id, value, { $new: true }).lean();
  }

  async deleteDoc(id) {
    return instituteModal.findByIdAndDelete(id).lean();
  }
}

export const instituteService = new InstituteServices();
