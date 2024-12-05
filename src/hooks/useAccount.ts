import accountApiRequest from "@/apiRequest/account";
import {
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const queryKeys = {
  listAccount: "get-list-account",
  accountById: "get-account-by-id",
};

export const useGetListAccount = () => {
  return useQuery({
    queryKey: [queryKeys.listAccount],
    queryFn: accountApiRequest.getListAccount,
  });
};

export const useGetAccountById = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: [queryKeys.accountById, id],
    queryFn: async () => {
      return await accountApiRequest.getAccountById(id);
    },
    enabled: !!id,
  });
};

export const useAddAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateEmployeeAccountBodyType) => {
      return accountApiRequest.addAccount(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.listAccount],
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
        queryKey: [queryKeys.listAccount],
        exact: true,
      });
    },
  });
};

export const useDeleteAccount = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountApiRequest.deleteAccount,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.listAccount],
      });
    },
  });
};
