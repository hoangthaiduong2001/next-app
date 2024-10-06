import { ACCESS_TOKEN, REFRESH_TOKEN, USER_INFO } from "@/constants/auth";
import { LoginResType } from "@/schemaValidations/auth.schema";

export const persistToken = (data: LoginResType) => {
  const {
    data: { accessToken, refreshToken, account },
  } = data;
  localStorage.setItem(USER_INFO, JSON.stringify(account));
  localStorage.setItem(ACCESS_TOKEN, accessToken);
  localStorage.setItem(REFRESH_TOKEN, refreshToken);
};

export const getAccessToken = () => {
  const token = localStorage.getItem(ACCESS_TOKEN) as string;
  return token;
};

export const getRefreshToken = () => {
  const token = localStorage.getItem(REFRESH_TOKEN) as string;
  return token;
};

export const removeAccessToken = () => {
  localStorage.removeItem(ACCESS_TOKEN);
};

export const removeRefreshToken = () => {
  localStorage.removeItem(REFRESH_TOKEN);
};

export const clearPersistToken = () => {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
  localStorage.removeItem(USER_INFO);
};
