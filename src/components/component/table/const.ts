import { OrderStatusValues } from "@/constants/type";

export const PAGE_SIZE = 10;
export const changeStatus = async (body: {
  orderId: number;
  dishId: number;
  status: (typeof OrderStatusValues)[number];
  quantity: number;
}) => {};
