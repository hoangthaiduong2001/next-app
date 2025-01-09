import { IItemTableContext } from "@/components/component/table/type";
import { DishStatus } from "@/constants/type";
import { createContext } from "react";
import { DishItem } from "./type";

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
