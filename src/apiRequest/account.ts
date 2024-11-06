import http from "@/config/http";
import {
  AccountResType,
  ChangePasswordBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

const accountApiRequest = {
  getAccount: () => http.get<AccountResType>("/accounts/me"),
  updateAccount: (body: UpdateMeBodyType) => http.put<AccountResType>("/accounts/me", body),
  changePassword: (body: ChangePasswordBodyType) => http.put<AccountResType>('accounts/change-password', body)
};

export default accountApiRequest;
