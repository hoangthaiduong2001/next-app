import { envConfig } from "@/config/enviroment";
import {
  AUTHENTICATION_ERROR_STATUS,
  FORBIDDEN_ERROR_STATUS,
} from "@/constants/status";
import { normalizePath } from "@/lib/utils";
import {
  LoginResType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import { CustomOptions, IPlainObject } from "@/types/common";
import { ErrorResponseDto } from "@/types/error";
import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from "axios";
import {
  axiosHttp,
  clearCacheAndNavigateToLoginPage,
  getAccessToken,
  persistTokenAndAccount,
  refreshTokenFn,
  removeAccessToken,
} from "./storage";

// let clientLogoutRequest: null | Promise<any> = null;

const isNavigatingLoginPage = false;
let refreshTokenPromise: Promise<RefreshTokenResType | undefined> | null;
const clearPromise = () => (refreshTokenPromise = null);
const isClient = typeof window !== "undefined";

const request = async <Response>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  url: string,
  options?: CustomOptions | undefined
) => {
  let body: FormData | string | undefined = undefined;
  const baseUrl = isClient
    ? envConfig.NEXT_PUBLIC_URL
    : envConfig.NEXT_PUBLIC_API_ENDPOINT;

  if (options?.body instanceof FormData) {
    body = options.body;
  } else if (options?.body) {
    body = JSON.stringify(options.body);
  }
  const baseHeaders: IPlainObject =
    body instanceof FormData
      ? {}
      : {
          "Content-Type": "application/json",
        };
  const axiosInstance = axiosHttp(baseUrl, baseHeaders);
  const fullUrl = `${baseUrl}/${normalizePath(url)}`;
  const res = await axiosInstance({
    method,
    url: fullUrl,
    data: body,
    headers: {
      ...baseHeaders,
    },
  });
  const responseData: Response = await res.data;
  const data = {
    status: res.status,
    response: responseData,
  };
  if (isClient && url === "/api/auth/login") {
    const data = responseData as LoginResType;
    persistTokenAndAccount(data);
  }
  axiosInstance.interceptors.request.use((config) => {
    config.paramsSerializer = {
      indexes: null,
    };
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  });
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError): Promise<ErrorResponseDto | undefined> => {
      const errorStatusCode = error.response?.status;
      if (
        (errorStatusCode === AUTHENTICATION_ERROR_STATUS ||
          errorStatusCode === FORBIDDEN_ERROR_STATUS) &&
        !error.config?.url?.includes("api/auth/login")
      ) {
        if (!refreshTokenPromise) {
          removeAccessToken();
          refreshTokenPromise = refreshTokenFn().finally(clearPromise);
        }
        const result = await refreshTokenPromise;
        const accessToken = result?.data.accessToken;
        if (accessToken) {
          const originalConfig: InternalAxiosRequestConfig =
            error.config as InternalAxiosRequestConfig;
          originalConfig.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance.request({ ...originalConfig });
        }
      } else {
        clearCacheAndNavigateToLoginPage(error, isNavigatingLoginPage);
      }
    }
  );

  return data;
};

const http = {
  get<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("GET", url, options);
  },
  post<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("POST", url, { ...options, body });
  },
  put<Response>(
    url: string,
    body: any,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("PUT", url, { ...options, body });
  },
  delete<Response>(
    url: string,
    options?: Omit<CustomOptions, "body"> | undefined
  ) {
    return request<Response>("DELETE", url, { ...options });
  },
};

export default http;
