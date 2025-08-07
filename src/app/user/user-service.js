import { userModel } from "./user-schema.js";

class userService {
  async updateService(id, value) {
    let update = await userModel.findByIdAndUpdate(id, { $set: { ...value } });

    if (!update) {
      return { error: true, message: "Failed to update user!" };
    }

    return update;
  }
}

export const userServices = new userService();
