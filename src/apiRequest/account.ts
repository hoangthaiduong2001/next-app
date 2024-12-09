import http from "@/config/http";
import {
  AccountListResType,
  AccountResType,
  CreateEmployeeAccountBodyType,
  UpdateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";

const accountApiRequest = {
  getListAccount: () => http.get<AccountListResType>("/accounts"),
  addAccount: (body: CreateEmployeeAccountBodyType) =>
    http.post<AccountResType>("/accounts", body),
  updateAccount: (id: number, body: UpdateEmployeeAccountBodyType) =>
    http.put<AccountResType>(`/accounts/detail/${id}`, body),
  getAccountById: (id: number) =>
    http.get<AccountResType>(`/accounts/detail/${id}`),
  deleteAccount: (id: number) =>
    http.delete<AccountResType>(`/accounts/detail/${id}`),
};

export default accountApiRequest;
