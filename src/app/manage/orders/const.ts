import {
  IItemTableContext,
  OrderObjectByGuestID,
  TChangeStatusOrder,
} from "@/components/component/table/type";
import { endOfDay, startOfDay } from "date-fns";
import { createContext } from "react";
import { DishItem } from "../dishes/type";
import { TableItem } from "../tables/type";
import { TFilterValue, TOrders } from "./type";

export const initFromDate = startOfDay(new Date());

export const initToDate = endOfDay(new Date());

export const filterValue: TFilterValue[] = [
  {
    id: 1,
    placeholder: "Name guest",
    value: "guestName",
    width: 100,
  },
  {
    id: 2,
    placeholder: "ID",
    value: "tableNumber",
    width: 80,
  },
];

export const OrderTableContext = createContext<IItemTableContext<TOrders>>({
  itemIdEdit: undefined,
  setItemIdEdit: (value: number | undefined) => {},
  changeStatus: (payload: TChangeStatusOrder) => {},
  orderObjectByGuestId: {} as OrderObjectByGuestID,
});

export const TableItemContext = createContext<IItemTableContext<TableItem>>({
  itemIdEdit: undefined,
  setItemIdEdit: (value: number | undefined) => {},
});

export const DishTableContext = createContext<IItemTableContext<DishItem>>({
  itemIdEdit: undefined,
  setItemIdEdit: (value: number | undefined) => {},
});
