import { IPlainObject } from "@/types/common";
import { UseMutateFunction } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import React, { Context } from "react";

type TData<T> = {
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

export type TTableProps<TRowDataType extends IPlainObject> = {
  name: string;
  pathname: string;
  columns: ColumnDef<TRowDataType>[];
  data: TRowDataType[];
  tableContext: Context<TRowDataType>;
  initRows?: TRowDataType[];
  AddItem: React.ComponentType;
  EditItem: React.ComponentType<TEditItem>;
  mutationItem: UseMutateFunction<TData<TRowDataType>, Error, number, unknown>;
};

export interface IItemTableContext<T extends IPlainObject> {
  itemIdEdit: number | undefined;
  itemDelete: T | null;
  setItemIdEdit: (value: number | undefined) => void;
  setItemDelete: (value: T | null) => void;
}
