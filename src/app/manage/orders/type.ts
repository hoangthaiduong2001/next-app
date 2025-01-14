import { GetListGuestsResType } from "@/schemaValidations/account.schema";
import { DishListResType } from "@/schemaValidations/dish.schema";
import { GetOrdersResType } from "@/schemaValidations/order.schema";
import { TableListResType } from "@/schemaValidations/table.schema";
import { Table } from "@tanstack/react-table";

export type TOrders = GetOrdersResType["data"][0];
export type TDish = DishListResType["data"][0];
export type TTable = TableListResType["data"][0];
export type TGuest = GetListGuestsResType["data"][0];

export type TDatePicker = {
  fromDate: Date;
  toDate: Date;
  setFromDate: (value: Date) => void;
  setToDate: (value: Date) => void;
};

export type TFilterValue = {
  id: number;
  placeholder?: string;
  value: string;
  width: number;
};

export type TFilterTableOrder<TRowDataType> = {
  table: Table<TRowDataType>;
  openStatusFilter: boolean;
  setOpenStatusFilter: (value: boolean) => void;
};
