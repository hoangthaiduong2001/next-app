"use client";

import { getRefreshTokenFromLocalStorage } from "@/config/storage";
import { REFRESH_TOKEN } from "@/constants/auth";
import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

const LogoutPage = () => {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get(REFRESH_TOKEN);
  const ref = useRef<any>(null);
  useEffect(() => {
    if (
      ref.current ||
      refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()
    ) {
      return;
    }
    ref.current = mutateAsync;
    mutateAsync().then(() => {
      setTimeout(() => {
        ref.current = null;
      }, 1000);
      router.push("/login");
      router.refresh();
    });
  }, [router, mutateAsync, refreshTokenFromUrl]);
  return <div>page</div>;
};

export default LogoutPage;
