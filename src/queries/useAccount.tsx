import accountApiRequest from "@/apiRequest/account";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAccountProfile = () => {
  return useQuery({
    queryKey: ["account-profile"],
    queryFn: accountApiRequest.getAccount,
  });
};

export const useUpdateAccountMe = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateAccount,
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePassword,
  })
}
