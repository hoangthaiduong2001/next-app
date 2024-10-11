import { envConfig } from "@/config/enviroment";

import { HTTP_STATUS } from "@/constants/status";
import { normalizePath } from "@/lib/utils";
import { pathClient, pathServer } from "@/routes/path";
import {
  LoginResType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import { CustomOptions, IPlainObject } from "@/types/common";
import { ErrorResponseDto } from "@/types/error";
import {
  AxiosError,
  AxiosHeaders,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {
  axiosHttp,
  clearCacheAndNavigateToLoginPage,
  clearPersistToken,
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
  // const baseUrl = isClient
  //   ? envConfig.NEXT_PUBLIC_URL
  //   : envConfig.NEXT_PUBLIC_API_ENDPOINT;
  const baseUrl =
    options?.baseUrl === undefined
      ? envConfig.NEXT_PUBLIC_API_ENDPOINT
      : options.baseUrl;

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
  if (!isClient && url !== pathServer.login) {
    baseHeaders.Authorization = (
      options?.headers as AxiosHeaders
    ).Authorization;
  }
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
  if (isClient) {
    if (url === pathClient.login) {
      const data = responseData as LoginResType;
      persistTokenAndAccount(data);
    } else if (url === pathClient.logout) {
      clearPersistToken();
    }
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
        (errorStatusCode === HTTP_STATUS.UNAUTHORIZED ||
          errorStatusCode === HTTP_STATUS.FORBIDDEN) &&
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
