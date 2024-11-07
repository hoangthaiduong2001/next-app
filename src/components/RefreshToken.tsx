"use client";

import { authApiRequest } from "@/apiRequest/auth";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLocalStorage,
  setRefreshTokenToLocalStorage,
} from "@/config/storage";
import jwt from "jsonwebtoken";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

const unAuthentication = ["/login", "logout", "refresh-token"];
const TIMEOUT = 1000;
const RefreshToken = () => {
  const pathname = usePathname();
  useEffect(() => {
    if (unAuthentication.includes(pathname)) return;
    let interval: any = null;
    const handleCheckAndRefreshToken = async () => {
      const accessToken = getAccessTokenFromLocalStorage();
      const refreshToken = getRefreshTokenFromLocalStorage();
      if (!accessToken || !refreshToken) return null;
      const decodeAccessToken = jwt.decode(accessToken) as {
        exp: number;
        iat: number;
      };
      const decodeRefreshToken = jwt.decode(refreshToken) as {
        exp: number;
        iat: number;
      };
      const now = Math.round(new Date().getTime() / 1000);
      if (decodeRefreshToken.exp <= now) return;
      if (
        decodeAccessToken.exp - now <
        (decodeAccessToken.exp - decodeAccessToken.iat) / 3
      ) {
        try {
          const res = await authApiRequest.clientRefreshToken();
          setAccessTokenToLocalStorage(res.response.data.accessToken);
          setRefreshTokenToLocalStorage(res.response.data.refreshToken);
        } catch {
          clearInterval(interval);
        }
      }
    };
    handleCheckAndRefreshToken();
    interval = setInterval(handleCheckAndRefreshToken, TIMEOUT);
  }, [pathname]);
  return null;
};

export default RefreshToken;
