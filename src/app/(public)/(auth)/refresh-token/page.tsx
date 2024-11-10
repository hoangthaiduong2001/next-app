"use client";

import { getRefreshTokenFromLocalStorage } from "@/config/storage";
import { handleCheckAndRefreshToken } from "@/config/utils";
import { REFRESH_TOKEN } from "@/constants/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const RefreshTokenPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get(REFRESH_TOKEN);
  const redirectPathname = searchParams.get("redirect");
  useEffect(() => {
    if (
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFromLocalStorage()
    ) {
      handleCheckAndRefreshToken({
        onSuccess: () => {
          console.log("redirectPathname", redirectPathname);
          router.push(redirectPathname || "/");
        },
      });
    }
  }, [router, refreshTokenFromUrl, redirectPathname]);
  return <div>page</div>;
};

export default RefreshTokenPage;
