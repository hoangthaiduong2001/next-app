import http from "@/config/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";
import axios from "axios";

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
    axios.post<RefreshTokenResType>(
      "http://localhost:4000/auth/refresh-token",
      {
        refreshToken: body.refreshToken,
      }
    ),
  clientLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),
  clientLogout: () =>
    http.post<MessageResType>("/api/auth/logout", null, {
      baseUrl: "",
    }),
  clientRefreshToken: (body: RefreshTokenBodyType) =>
    axios.post<RefreshTokenResType>(
      "http://localhost:3000/api/auth/refresh-token",
      { refreshToken: body.refreshToken }
    ),
};
