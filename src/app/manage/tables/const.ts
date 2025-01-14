import { IItemTableContext } from "@/components/component/table/type";
import { TableStatus } from "@/constants/type";
import { createContext } from "react";
import { TableItem } from "./type";

export const defaultValueAddable = {
  number: 0,
  capacity: 2,
  status: TableStatus.Hidden,
};

export const TableContext = createContext<IItemTableContext<TableItem>>({
  itemIdEdit: undefined,
  itemDelete: null,
  setItemIdEdit: (value: number | undefined) => {},
  setItemDelete: (value: TableItem | null) => {},
});
