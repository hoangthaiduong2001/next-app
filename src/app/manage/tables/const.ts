import { TableStatus } from "@/constants/type";

export const defaultValueAddable = {
  number: 0,
  capacity: 2,
  status: TableStatus.Hidden,
};

export const defaultValueEditTable = {
  capacity: 2,
  status: TableStatus.Hidden,
  changeToken: false,
};
