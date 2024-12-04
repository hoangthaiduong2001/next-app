/* eslint-disable @typescript-eslint/no-unused-expressions */
import { authApiRequest } from "@/apiRequest/auth";
import envConfig from "@/config";
import { DishStatus, TableStatus } from "@/constants/type";
import { toast } from "@/hooks/useToast";
import { clsx, type ClassValue } from "clsx";
import jwt from "jsonwebtoken";
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
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
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
  const decodeAccessToken = jwt.decode(accessToken) as {
    exp: number;
    iat: number;
  };
  const decodeRefreshToken = jwt.decode(refreshToken) as {
    exp: number;
    iat: number;
  };
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
      const res = await authApiRequest.clientRefreshToken();
      setAccessTokenToLocalStorage(res.response.data.accessToken);
      setRefreshTokenToLocalStorage(res.response.data.refreshToken);
      param?.onSuccess && param.onSuccess();
    } catch {
      param?.onError && param.onError();
    }
  }
};

export const getVietnameseDishStatus = (
  status: (typeof DishStatus)[keyof typeof DishStatus]
) => {
  switch (status) {
    case DishStatus.Available:
      return "Available";
    case DishStatus.Unavailable:
      return "Unavailable";
    default:
      return "Hide";
  }
};

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

export const getVietnameseTableStatus = (
  status: (typeof TableStatus)[keyof typeof TableStatus]
) => {
  switch (status) {
    case TableStatus.Available:
      return "Available";
    case TableStatus.Reserved:
      return "Reserved";
    default:
      return "Hidden";
  }
};

export const getTableLink = ({
  token,
  tableNumber,
}: {
  token: string;
  tableNumber: number;
}) => {
  return (
    envConfig.NEXT_PUBLIC_URL + "/tables/" + tableNumber + "?token=" + token
  );
};
