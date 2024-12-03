import http from "@/config/http";
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";

const dishApiRequest = {
  getListDish: () => http.get<DishListResType>("/dishes"),
  addDish: (body: CreateDishBodyType) =>
    http.post<DishResType>("/dishes", body),
  getDishById: (id: number) => http.get<DishResType>(`/dishes/${id}`),
  updateDish: (id: number, body: UpdateDishBodyType) =>
    http.put<DishResType>(`/dishes/${id}`, body),
  deleteDish: (id: number) => http.delete<DishResType>(`/dishes/${id}`),
};

export default dishApiRequest;
