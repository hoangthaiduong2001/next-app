import { AccountListResType } from "@/schemaValidations/account.schema";

export type AccountItem = AccountListResType["data"][0];

export type TEditEmployee = {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
};
