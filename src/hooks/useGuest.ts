import { guestApiRequest } from "@/apiRequest/guest";
import { GetGuestListQueryParamsType } from "@/schemaValidations/account.schema";
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

export const useGetGuestListQuery = (
  queryParams: GetGuestListQueryParamsType
) => {
  return useQuery({
    queryFn: () => guestApiRequest.guestList(queryParams),
    queryKey: ["guests", queryParams],
  });
};

export const useCreateGuestMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.createGuest,
  });
};
