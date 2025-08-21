import { ordersModel } from "./schema.js";

class Orders {
  async createOrder(value) {
    return await ordersModel.create(value);
  }
}

export const ordersService = new Orders();
