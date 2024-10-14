import http from "@/config/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
} from "@/schemaValidations/auth.schema";

export const authApiRequest = {
  serverLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/auth/login", body),
  serverLogout: (body: LogoutBodyType & { accessToken: string }) =>
    http.post<LoginResType>(
      "/auth/logout",
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      }
    ),
  clientLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),
  clientLogout: () =>
    http.post("/api/auth/logout", null, {
      baseUrl: "",
    }),
};
