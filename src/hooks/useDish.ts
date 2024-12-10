import dishApiRequest from "@/apiRequest/dish";
import {
  CreateDishBodyType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const queryKeys = {
  listDish: "get-list-dish",
  dishById: "get-dish-by-id",
};
export const useGetListDish = () => {
  return useQuery({
    queryKey: [queryKeys.listDish],
    queryFn: dishApiRequest.getListDish,
  });
};

export const useGetDishById = ({ id }: { id: number }) => {
  return useQuery({
    queryKey: [queryKeys.listDish, id],
    queryFn: async () => {
      return await dishApiRequest.getDishById(id);
    },
    enabled: !!id,
  });
};

export const useAddDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateDishBodyType) => {
      return dishApiRequest.addDish(body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.listDish],
      });
    },
  });
};

export const useUpdateDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) =>
      dishApiRequest.updateDish(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.listDish],
        exact: true,
      });
    },
  });
};

export const useDeleteDish = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => {
      return dishApiRequest.deleteDish(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.listDish],
      });
    },
  });
};
