import { ACCESS_TOKEN, REFRESH_TOKEN, USER_INFO } from "@/constants/auth";
import { toast } from "@/hooks/use-toast";
import {
  LoginResType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import { IPlainObject } from "@/types/common";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import Cookies from "js-cookie";
export const persistTokenAndAccount = (data: LoginResType) => {
  const {
    data: { accessToken, refreshToken, account },
  } = data;
  localStorage.setItem(USER_INFO, JSON.stringify(account));
  localStorage.setItem(ACCESS_TOKEN, accessToken);
  localStorage.setItem(REFRESH_TOKEN, refreshToken);
};

export const persistToken = (data: RefreshTokenResType) => {
  const {
    data: { accessToken, refreshToken },
  } = data;
  localStorage.setItem(ACCESS_TOKEN, accessToken);
  localStorage.setItem(REFRESH_TOKEN, refreshToken);
};

export const getAccessToken = () => {
  const token = localStorage.getItem(ACCESS_TOKEN) as string;
  return token;
};

export const getRefreshToken = () => {
  let token = "";
  if (typeof window !== "undefined") {
    token = localStorage.getItem(REFRESH_TOKEN) as string;
  } else {
    token = Cookies.get(REFRESH_TOKEN) || "";
  }
  return token;
};

export const removeAccessToken = () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(ACCESS_TOKEN);
  }
};

export const removeRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN);
};

export const clearPersistToken = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(USER_INFO);
};

export const axiosHttp = (
  baseURL: string,
  headers: IPlainObject
): AxiosInstance => {
  const axiosInstance = axios.create({
    baseURL,
    timeout: 5000,
    headers,
  });
  return axiosInstance;
};

export const refreshTokenFn = async (): Promise<
  RefreshTokenResType | undefined
> => {
  const refreshToken = getRefreshToken();
  console.log("refreshToken", refreshToken);
  try {
    console.log("456");
    await axios
      .post<
        RefreshTokenResType,
        AxiosResponse<RefreshTokenResType, RefreshTokenBodyType>,
        RefreshTokenBodyType
      >("/auth/refresh-token", {
        refreshToken,
      })
      .catch((err) => console.log("loi o day", err));
    const res = await axios.post<
      RefreshTokenResType,
      AxiosResponse<RefreshTokenResType, RefreshTokenBodyType>,
      RefreshTokenBodyType
    >("/auth/refresh-token", {
      refreshToken,
    });
    const { data } = res;
    console.log("refretokenres", res);
    persistToken(data);
    return data;
  } catch (error) {
    console.log("error in refreserToken", error);
  }
};

export const clearCacheAndNavigateToLoginPage = (
  error: AxiosError,
  isNavigatingLoginPage: boolean
) => {
  if (isNavigatingLoginPage) {
    return;
  }

  isNavigatingLoginPage = true;

  setTimeout(() => {
    isNavigatingLoginPage = false;
  }, 1000);

  clearPersistToken();

  //TODO: Using navigate from react router instead of hardcode with hash router
  window.location.href = "/login";
  toast({ description: "Error clear cache and navigate" });
  console.log(error);
};
