import http from "@/config/http";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

export const authApiRequest = {
  sLogin: (body: LoginBodyType) => http.post<LoginResType>("/auth/login", body),
  cLogin: (body: LoginBodyType) =>
    http.post<LoginResType>("/api/auth/login", body, {
      baseUrl: "",
    }),
};
