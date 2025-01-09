import { IItemTableContext } from "@/components/component/table/type";
import { createContext } from "react";
import { AccountItem } from "./type";

export const AccountTableContext = createContext<
  IItemTableContext<AccountItem>
>({
  itemIdEdit: undefined,
  itemDelete: null,
  setItemIdEdit: (value: number | undefined) => {},
  setItemDelete: (value: AccountItem | null) => {},
});

export const defaultValueAddAccount = {
  name: "",
  email: "",
  avatar: undefined,
  password: "",
  confirmPassword: "",
};
