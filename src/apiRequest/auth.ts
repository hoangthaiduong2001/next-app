import http from "@/config/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";

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
  serverRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("auth/refresh-token", body),
  clientLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),
  clientLogout: () =>
    http.post<MessageResType>("/api/auth/logout", null, {
      baseUrl: "",
    }),
  clientRefreshToken: () =>
    http.post<RefreshTokenResType>("api/auth/refresh-token", null, {
      baseUrl: "",
    }),
};
