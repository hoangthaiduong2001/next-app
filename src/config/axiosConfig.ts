import { authApiRequest } from "@/apiRequest/auth";
import { envConfig } from "@/config/enviroment";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/auth";
import { HTTP_STATUS } from "@/constants/status";
import { RefreshTokenResType } from "@/schemaValidations/auth.schema";
import { IPlainObject } from "@/types/common";
import { ErrorResponseDto } from "@/types/error";
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getAccessToken } from "./storage";

type TAxiosInstance = {
  baseURL?: string;
  headers?: IPlainObject;
};

const isServer = () => {
  return typeof window === "undefined";
};

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
    withCredentials: true,
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
      console.log("error", error);
      const { cookies } = await import("next/headers");
      const cookieStore = cookies();
      const errorStatusCode = error.response?.status;
      if (
        (errorStatusCode === HTTP_STATUS.UNAUTHORIZED ||
          errorStatusCode === HTTP_STATUS.FORBIDDEN) &&
        !error.config?.url?.includes("api/auth/login")
      ) {
        let refreshToken = "";
        if (isServer()) {
          refreshToken = cookieStore.get("refreshToken")?.value || "";
        }

        if (!refreshTokenPromise) {
          refreshTokenPromise = authApiRequest
            .clientRefreshToken({
              refreshToken,
            })
            .then((response) => response.data)
            .finally(clearPromise);
        }

        const result = await refreshTokenPromise;
        if (result) {
          const { accessToken, refreshToken } = result?.data;
          cookieStore.set(ACCESS_TOKEN, accessToken);
          cookieStore.set(REFRESH_TOKEN, refreshToken);
          const originalConfig: InternalAxiosRequestConfig =
            error.config as InternalAxiosRequestConfig;
          originalConfig.headers.Authorization = `Bearer ${accessToken}`;
          return axiosInstance(originalConfig);
        }
      } else {
        console.log("navigate login");
        // clearCacheAndNavigateToLoginPage(error, isNavigatingLoginPage);
      }
      return Promise.reject(error.response?.data || error);
    }
  );
  return axiosInstance;
};

export default axiosHttp;
