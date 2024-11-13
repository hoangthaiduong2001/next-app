import accountApiRequest from "@/apiRequest/account";
import { UpdateEmployeeAccountBodyType } from "@/schemaValidations/account.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetListAccount = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: accountApiRequest.getListAccount,
  });
};

export const useGetAccountById = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: ["accounts", id],
    queryFn: () => accountApiRequest.getAccountById(id),
    enabled: !!id,
  });
};

export const useAddAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountApiRequest.addAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });
};

export const useUpdateAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: UpdateEmployeeAccountBodyType & { id: number }) =>
      accountApiRequest.updateAccount(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
        exact: true,
      });
    },
  });
};

export const useDeleteAccount = ({ id }: { id: number }) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => accountApiRequest.deleteAccount(id),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });
};
