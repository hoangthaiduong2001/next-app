import { endOfDay, startOfDay } from "date-fns";
import { TFilterValue } from "./type";

export const initFromDate = startOfDay(new Date());

export const initToDate = endOfDay(new Date());

export const filterValue: TFilterValue[] = [
  {
    id: 1,
    placeholder: "Name guest",
    value: "guestName",
    width: 100,
  },
  {
    id: 2,
    placeholder: "ID",
    value: "tableNumber",
    width: 80,
  },
];
