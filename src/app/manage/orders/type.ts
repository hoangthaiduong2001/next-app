import { GetOrdersResType } from "@/schemaValidations/order.schema";
import { Table } from "@tanstack/react-table";

export type TOrders = GetOrdersResType["data"][0];

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
