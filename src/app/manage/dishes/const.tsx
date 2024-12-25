import { DishStatus } from "@/constants/type";
export const PAGE_SIZE = 10;

export const defaultValueFormDish = {
  name: "",
  description: "",
  price: 0,
  image: undefined,
  status: DishStatus.Unavailable,
};
