import { TableListResType } from "@/schemaValidations/table.schema";

export type TableItem = TableListResType["data"][0];

export type TEditTable = {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
};
