import orderApishApiRequest from "@/apiRequest/order";
import {
  GetOrdersQueryParamsType,
  PayGuestOrdersBodyType,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      ...body
    }: UpdateOrderBodyType & {
      orderId: number;
    }) => orderApishApiRequest.updateOrder(orderId, body),
  });
};

export const useGetOrderListQuery = (queryParam: GetOrdersQueryParamsType) => {
  return useQuery({
    queryFn: () => orderApishApiRequest.getOrderList(queryParam),
    queryKey: ["orders", queryParam],
  });
};

export const useGetOrderDetailQuery = ({
  orderId,
  enabled,
}: {
  orderId: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryFn: () => orderApishApiRequest.getOrderDetail(orderId),
    queryKey: ["orders", orderId],
    enabled,
  });
};

export const usePayOrderMutation = () => {
  return useMutation({
    mutationFn: (body: PayGuestOrdersBodyType) =>
      orderApishApiRequest.pay(body),
  });
};

export const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: orderApishApiRequest.createOrders,
  });
};
