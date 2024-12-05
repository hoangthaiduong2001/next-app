import http from "@/config/http";
import {
  CreateTableBodyType,
  TableListResType,
  TableResType,
  UpdateTableBodyType,
} from "@/schemaValidations/table.schema";

const tableApiRequest = {
  getListTable: () => http.get<TableListResType>("/tables"),
  addTable: (body: CreateTableBodyType) =>
    http.post<TableResType>("/tables", body),
  getTableById: (id: number) => http.get<TableResType>(`/tables/${id}`),
  updateTable: (id: number, body: UpdateTableBodyType) =>
    http.put<TableResType>(`/tables/${id}`, body),
  deleteTable: (id: number) => http.delete<TableResType>(`/tables/${id}`),
};

export default tableApiRequest;
