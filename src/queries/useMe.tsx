import meApiRequest from "@/apiRequest/me";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useGetProfileMe = () => {
  return useQuery({
    queryKey: ["me"],
    queryFn: meApiRequest.getMe,
  });
};

export const useUpdateMe = () => {
  return useMutation({
    mutationFn: meApiRequest.updateMe,
  });
};

export const useChangePassword = () => {
  return useMutation({
    mutationFn: meApiRequest.changePassword,
  });
};
