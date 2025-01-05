import { guestApiRequest } from "@/apiRequest/guest";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.clientLogin,
  });
};

export const useGuestLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.clientLogout,
  });
};

export const useGuestOrderMutation = () => {
  return useMutation({
    mutationFn: (body: GuestCreateOrdersBodyType) => {
      return guestApiRequest.order(body);
    },
  });
};

export const useGuestGetOrderList = () => {
  return useQuery({
    queryFn: guestApiRequest.getOrderList,
    queryKey: ["guest-orders"],
  });
};
