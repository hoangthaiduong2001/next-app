import { guestApiRequest } from "@/apiRequest/guest";
import { useMutation } from "@tanstack/react-query";

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
