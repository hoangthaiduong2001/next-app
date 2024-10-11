import http from "@/config/http";
import { AccountResType } from "@/schemaValidations/account.schema";

const accountApiRequest = {
  serverGetAccount: (accessToken: string) =>
    http.get<AccountResType>("/accounts/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  clientGetAccount: () =>
    http.get<AccountResType>("/api/accounts/me", {
      baseUrl: "",
    }),
};

export default accountApiRequest;
