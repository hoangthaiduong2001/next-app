import { IPlainObject } from "@/types/common";
import { ColumnDef } from "@tanstack/react-table";

export type TRowDataType = IPlainObject;

export type TTableProps<TRowDataType extends IPlainObject> = {
  columns: ColumnDef<TRowDataType>[];
  initRows?: TRowDataType[];
};

export type TItemTableContext<TRowDataType extends IPlainObject> = {
  setItemIdEdit: (value: number) => void;
  itemIdEdit: number | undefined;
  itemDelete: TRowDataType | null;
  setItemDelete: (value: TRowDataType | null) => void;
};
