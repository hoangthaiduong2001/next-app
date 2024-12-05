"use client";

import { useAppContext } from "@/components/AppProvider";
import { getRefreshTokenFromLocalStorage } from "@/config/storage";
import { REFRESH_TOKEN } from "@/constants/auth";
import { useLogoutMutation } from "@/hooks/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const LogoutPage = () => {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const { setIsAuth } = useAppContext();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get(REFRESH_TOKEN);
  const ref = useRef<any>(null);
  useEffect(() => {
    if (
      !ref.current &&
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFromLocalStorage()
    ) {
      ref.current = mutateAsync;
      mutateAsync().then(() => {
        setTimeout(() => {
          ref.current = null;
        }, 1000);
        setIsAuth(false);
        router.push("/login");
        router.refresh();
      });
    } else {
      router.push("/");
    }
  }, [router, mutateAsync, refreshTokenFromUrl, setIsAuth]);
  return <div>page</div>;
};

export default LogoutPage;
