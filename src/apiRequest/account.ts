import http from "@/config/http";
import {
  AccountResType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

const accountApiRequest = {
  serverGetAccount: (accessToken: string) =>
    http.get<AccountResType>("/accounts/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  serverUpdateAccountMe: (accessToken: string, body: UpdateMeBodyType) =>
    http.put<AccountResType>("/accounts/me", body, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  clientGetAccount: () =>
    http.get<AccountResType>("/api/accounts/me", {
      baseUrl: "",
    }),
  clientUpdateAccountMe: (body: UpdateMeBodyType) =>
    http.put<AccountResType>("/api/accounts/me", body, {
      baseUrl: "",
    }),
};

export default accountApiRequest;
