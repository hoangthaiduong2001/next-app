import { DishListResType } from "@/schemaValidations/dish.schema";

export type DishItem = DishListResType["data"][0];

export type TEditDish = {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
};
