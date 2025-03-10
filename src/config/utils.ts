/* eslint-disable @typescript-eslint/no-unused-expressions */
import { authApiRequest } from "@/apiRequest/auth";
import { guestApiRequest } from "@/apiRequest/guest";
import envConfig from "@/config";
import { OrderStatus, Role } from "@/constants/type";
import { toast } from "@/hooks/useToast";
import { TokenPayload } from "@/types/auth";
import { clsx, type ClassValue } from "clsx";
import { format } from "date-fns";
import jwt from "jsonwebtoken";
import { BookX, CookingPot, HandCoins, Loader, Truck } from "lucide-react";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./services";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  removeTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "./storage";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    error.response.errors.forEach((item) => {
      setError(item.field, {
        type: "server",
        message: item.message,
      });
    });
  } else {
    toast({
      title: "Error",
      description: error?.response?.message ?? "Unknown error",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

export const handleCheckAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();
  if (!accessToken || !refreshToken) return;
  const decodeAccessToken = decodeToken(accessToken);
  const decodeRefreshToken = decodeToken(refreshToken);
  const now = new Date().getTime() / 1000 - 1;
  if (decodeRefreshToken.exp <= now) {
    removeTokenFromLocalStorage();
    return param?.onError && param.onError();
  }
  if (
    decodeAccessToken.exp - now <
    (decodeAccessToken.exp - decodeAccessToken.iat) / 3
  ) {
    try {
      const role = decodeRefreshToken.role;
      const res =
        role === Role.Guest
          ? await guestApiRequest.clientRefreshToken()
          : await authApiRequest.clientRefreshToken();
      setAccessTokenToLocalStorage(res.response.data.accessToken);
      setRefreshTokenToLocalStorage(res.response.data.refreshToken);
      param?.onSuccess && param.onSuccess();
    } catch {
      param?.onError && param.onError();
    }
  }
};

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

export const getTableLink = ({
  token,
  tableNumber,
}: {
  token: string;
  tableNumber: number;
}) => {
  return (
    envConfig.NEXT_PUBLIC_URL +
    "/guest/tables/" +
    tableNumber +
    "?token=" +
    token
  );
};

export function removeAccents(str: string) {
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D");
}

export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(
    removeAccents(matchText.trim().toLowerCase())
  );
};

export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(
    date instanceof Date ? date : new Date(date),
    "HH:mm:ss dd/MM/yyyy"
  );
};

export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Processing]: CookingPot,
  [OrderStatus.Rejected]: BookX,
  [OrderStatus.Delivered]: Truck,
  [OrderStatus.Paid]: HandCoins,
};

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};
