"use client";

import { handleCheckAndRefreshToken } from "@/config/utils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

const unAuthentication = ["/login", "/logout", "/refresh-token"];
const TIMEOUT = 1000;
const RefreshToken = () => {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (unAuthentication.includes(pathname)) return;
    let interval: any = null;
    handleCheckAndRefreshToken({
      onError: () => {
        clearInterval(interval);
        router.push("/login");
      },
    });
    interval = setInterval(
      () =>
        handleCheckAndRefreshToken({
          onError: () => {
            clearInterval(interval);
            router.push("/login");
          },
        }),
      TIMEOUT
    );
    return () => {
      clearInterval(interval);
    };
  }, [pathname, router]);
  useEffect(() => {
    router.refresh();
  }, []);
  return null;
};

export default RefreshToken;
