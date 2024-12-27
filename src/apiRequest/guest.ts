import http from "@/config/http";
import {
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import { MessageResType } from "@/schemaValidations/common.schema";
import {
  GuestCreateOrdersBodyType,
  GuestCreateOrdersResType,
  GuestGetOrdersResType,
  GuestLoginBodyType,
  GuestLoginResType,
} from "@/schemaValidations/guest.schema";

type TRefreshTokenKey = {
  status: number;
  response: RefreshTokenResType;
};

export const guestApiRequest = {
  refreshTokenRequest: null as Promise<TRefreshTokenKey> | null,
  serverLogin: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>("/guest/auth/login", body),
  serverLogout: (body: LogoutBodyType & { accessToken: string }) =>
    http.post<LoginResType>(
      "/guest/auth/logout",
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
    http.post<RefreshTokenResType>("/guest/auth/refresh-token", body),
  clientLogin: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>("/api/guest/auth/login", body, {
      baseUrl: "",
    }),
  clientLogout: () =>
    http.post<MessageResType>("/api/guest/auth/logout", null, {
      baseUrl: "",
    }),
  async clientRefreshToken() {
    if (this.refreshTokenRequest) {
      return this.refreshTokenRequest;
    }
    this.refreshTokenRequest = http.post<RefreshTokenResType>(
      "api/guest/auth/refresh-token",
      null,
      {
        baseUrl: "",
      }
    );
    const result = await this.refreshTokenRequest;
    this.refreshTokenRequest = null;
    return result;
  },
  order: (body: GuestCreateOrdersBodyType) =>
    http.post<GuestCreateOrdersResType>("/guest/orders", body),
  getOrderList: () => http.get<GuestGetOrdersResType>("/guest/orders"),
};
