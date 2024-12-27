import http from "@/config/http";
import {
  GetOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";

const orderApishApiRequest = {
  getOrderList: () => http.get<GetOrdersResType>("/orders"),
  updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`/orders/${orderId}`, body),
};

export default orderApishApiRequest;
