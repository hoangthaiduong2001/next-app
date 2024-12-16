import tableApiRequest from "@/apiRequest/table";
import {
  CreateTableBodyType,
  UpdateTableBodyType,
} from "@/schemaValidations/table.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const queryKeys = {
  listTable: "get-list-table",
  tableById: "get-table-by-id",
};

export const useGetListTable = () => {
  return useQuery({
    queryKey: [queryKeys.listTable],
    queryFn: tableApiRequest.getListTable,
  });
};

export const useGetTableById = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: [queryKeys.tableById, id],
    queryFn: () => tableApiRequest.getTableById(id),
    enabled: !!id,
  });
};

export const useAddTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (body: CreateTableBodyType) => {
      return await tableApiRequest.addTable(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.listTable],
      });
    },
  });
};

export const useUpdateTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateTableBodyType & { id: number }) =>
      tableApiRequest.updateTable(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.listTable],
        exact: true,
      });
    },
  });
};

export const useDeleteTable = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => {
      return tableApiRequest.deleteTable(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.listTable],
      });
    },
  });
};
