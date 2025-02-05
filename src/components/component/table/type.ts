import { TDatePicker } from "@/app/manage/orders/type";
import { OrderStatusValues } from "@/constants/type";
import { GetOrdersResType } from "@/schemaValidations/order.schema";
import { IPlainObject } from "@/types/common";
import { UseMutateFunction, UseQueryResult } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import React, { Context } from "react";

export type TData<T> = {
  status: number;
  response: {
    data: T;
    message: string;
  };
};

type TEditItem = {
  id: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
};

export type TChangeStatusOrder = {
  orderId: number;
  dishId: number;
  status: (typeof OrderStatusValues)[number];
  quantity: number;
};

export type OrderObjectByGuestID = Record<number, GetOrdersResType["data"]>;

export type TTableProps<
  TRowDataType extends IPlainObject,
  TRowDataSort extends IPlainObject = object[]
> = {
  name: string;
  pathname: string;
  filterName: string;
  deleteById?: boolean;
  isOrder?: boolean;
  columns: ColumnDef<TRowDataType>[];
  data: TRowDataType[];
  tableContext: Context<IItemTableContext<TRowDataType>>;
  initRows?: TRowDataType[];
  AddItem: React.ComponentType;
  EditItem: React.ComponentType<TEditItem>;
  mutationItem?: UseMutateFunction<TData<TRowDataType>, Error, number, unknown>;
  queryListItem?: UseQueryResult<TData<TRowDataType[]>, Error>;
  queryItemByDate?: TDatePicker;
  tableListSortedByNumber?: TRowDataSort;
  onChoose?: (value: TRowDataType) => void;
  changeStatus?: (body: TChangeStatusOrder) => Promise<void>;
};

export interface IItemTableContext<T extends IPlainObject> {
  itemIdEdit: number | undefined;
  itemDelete?: T | null;
  setItemIdEdit: (value: number | undefined) => void;
  setItemDelete?: (value: T | null) => void;
  changeStatus?: (payload: TChangeStatusOrder) => void;
  orderObjectByGuestId?: OrderObjectByGuestID;
}
