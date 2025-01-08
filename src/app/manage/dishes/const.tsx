import { IItemTableContext } from "@/components/component/table/type";
import { DishStatus } from "@/constants/type";
import { DishListResType } from "@/schemaValidations/dish.schema";
import { createContext } from "react";
export const PAGE_SIZE = 10;

export type DishItem = DishListResType["data"][0];

export const DishTableContext = createContext<IItemTableContext<DishItem>>({
  itemIdEdit: undefined,
  itemDelete: null,
  setItemIdEdit: (value: number | undefined) => {},
  setItemDelete: (value: DishItem | null) => {},
});

export const defaultValueFormDish = {
  name: "",
  description: "",
  price: 0,
  image: undefined,
  status: DishStatus.Unavailable,
};
