import { envConfig } from "@/config/enviroment";
import { HTTP_STATUS } from "@/constants/status";
import { RefreshTokenResType } from "@/schemaValidations/auth.schema";
import { IPlainObject } from "@/types/common";
import { ErrorResponseDto } from "@/types/error";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import {
  clearCacheAndNavigateToLoginPage,
  getAccessToken,
  refreshTokenFn,
  removeAccessToken,
} from "./storage";

type TAxiosInstance = {
  baseURL?: string;
  headers?: IPlainObject;
};

const isNavigatingLoginPage = false;
let refreshTokenPromise: Promise<RefreshTokenResType | undefined> | null;
const clearPromise = () => (refreshTokenPromise = null);

const axiosHttp = ({
  baseURL = envConfig.NEXT_PUBLIC_URL,
  headers = { "Content-Type": "application/json" },
}: TAxiosInstance) => {
  const axiosInstance = axios.create({
    baseURL,
    timeout: 5000,
    headers,
  });
  axiosInstance.interceptors.request.use((config) => {
    config.paramsSerializer = {
      indexes: null,
    };
    if (typeof window !== "undefined") {
      const accessToken = getAccessToken();
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  });
  axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => {
      return response;
    },
    async (error: AxiosError): Promise<ErrorResponseDto | undefined> => {
      const errorStatusCode = error.response?.status;
      console.log("err in interceptor", error);
      console.log("errorStatusCode", errorStatusCode);
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
  return axiosInstance;
};

export default axiosHttp;
