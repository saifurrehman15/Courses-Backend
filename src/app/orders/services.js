import { ordersModel } from "./schema.js";

class Orders {
  async createOrder(value) {
    return await ordersModel.create(value);
  }

  async findOrder(query = {}) {
    return await ordersModel.find(query);
  }
}

export const ordersService = new Orders();
