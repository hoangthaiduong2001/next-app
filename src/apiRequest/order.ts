import http from "@/config/http";
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import queryString from "query-string";

const orderApishApiRequest = {
  getOrderList: (queryParam: GetOrdersQueryParamsType) =>
    http.get<GetOrdersResType>(
      "/orders?" +
        queryString.stringify({
          formDate: queryParam.fromDate?.toISOString(),
          toDate: queryParam.toDate?.toISOString(),
        })
    ),
  createOrders: (body: CreateOrdersBodyType) =>
    http.post<CreateOrdersResType>("/orders", body),
  updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
    http.put<UpdateOrderResType>(`/orders/${orderId}`, body),
  getOrderDetail: (orderId: number) =>
    http.get<GetOrderDetailResType>(`/orders/${orderId}`),
  pay: (body: PayGuestOrdersBodyType) =>
    http.post<PayGuestOrdersResType>(`/orders/pay`, body),
};

export default orderApishApiRequest;
