import accountApiRequest from "@/apiRequest/account";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAccountProfile = () => {
  return useQuery({
    queryKey: ["account-profile"],
    queryFn: accountApiRequest.clientGetAccount,
  });
};

export const useUpdateAccountMe = () => {
  return useMutation({
    mutationFn: accountApiRequest.clientUpdateAccountMe,
  });
};
