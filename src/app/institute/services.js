import { dbQueries } from "../../utils/db/queries.js";
import { userModel } from "../user/user-schema.js";
import { instituteModal } from "./schema.js";

class InstituteServices {
  async create({ body, user }) {
    const findInstitute = await instituteModal.findOne({
      $or: [{ ownerCnic: body.ownerCnic }, { createdBy: user._id }],
    });

    if (findInstitute) {
      return {
        error: "You can only create one institute with this account!",
        status: 403,
      };
    }
    
    const instituteCreated = await instituteModal.create({
      ...body,
      createdBy: user._id,
    });
    await userModel.findByIdAndUpdate(user._id, {
      $set: {
        owner: instituteCreated._id,
      },
    });
    return instituteCreated;
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
    const deleted = await instituteModal.findByIdAndDelete(id).lean();

    await userModel.findByIdAndUpdate(deleted.createdBy, {
      $unset: {
        owner: "",
      },
    });

    return deleted;
  }
}

export const instituteService = new InstituteServices();
