import {
  IItemTableContext,
  OrderObjectByGuestID,
  TChangeStatusOrder,
} from "@/components/component/table/type";
import { endOfDay, startOfDay } from "date-fns";
import { createContext } from "react";
import { TDish, TFilterValue, TGuest, TOrders, TTable } from "./type";

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

export const TableItemContext = createContext<IItemTableContext<TTable>>({
  itemIdEdit: undefined,
  setItemIdEdit: (value: number | undefined) => {},
});

export const DishTableContext = createContext<IItemTableContext<TDish>>({
  itemIdEdit: undefined,
  setItemIdEdit: (value: number | undefined) => {},
});

export const GuestTableContext = createContext<IItemTableContext<TGuest>>({
  itemIdEdit: undefined,
  setItemIdEdit: (value: number | undefined) => {},
});
