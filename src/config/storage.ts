import { ACCESS_TOKEN, REFRESH_TOKEN } from "@/constants/auth";

export const isClient = typeof window !== "undefined";

export const getAccessTokenFromLocalStorage = () => {
  if (isClient) {
    const token = localStorage.getItem(ACCESS_TOKEN);
    return token;
  }
  return null;
};

export const getRefreshTokenFromLocalStorage = () => {
  if (isClient) {
    const token = localStorage.getItem(REFRESH_TOKEN);
    return token;
  }
  return null;
};

export const setAccessTokenToLocalStorage = (value: string) => {
  if (isClient) {
    localStorage.setItem(ACCESS_TOKEN, value);
  }
};

export const setRefreshTokenToLocalStorage = (value: string) => {
  if (isClient) {
    localStorage.setItem(REFRESH_TOKEN, value);
  }
};
