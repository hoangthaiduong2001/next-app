import { IPlainObject } from "@/types/common";
import { UseMutateFunction } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import React, { Context } from "react";

export type TTableProps<TRowDataType extends IPlainObject> = {
  columns: ColumnDef<TRowDataType>[];
  data: TRowDataType[];
  tableContext: Context<TRowDataType>;
  initRows?: TRowDataType[];
  AddItem: React.ReactNode;
  EditItem: React.ComponentType<{
    id: number | undefined;
    setId: (value: number | undefined) => void;
  }>;
  mutationItem: UseMutateFunction<
    { status: number; response: { message: string; data: TRowDataType } },
    Error,
    number,
    unknown
  >;
};

export interface IItemTableContext<T extends IPlainObject> {
  itemIdEdit: number | undefined;
  itemDelete: T | null;
  setItemIdEdit: (value: number | undefined) => void;
  setItemDelete: (value: T | null) => void;
}
