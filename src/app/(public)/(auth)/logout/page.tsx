"use client";

import { useLogoutMutation } from "@/queries/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const LogoutPage = () => {
  const { mutateAsync } = useLogoutMutation();
  const router = useRouter();
  const ref = useRef<any>(null);
  useEffect(() => {
    if (ref.current) return;
    ref.current = mutateAsync;
    mutateAsync().then(() => {
      setTimeout(() => {
        ref.current = null;
      }, 1000);
    });
    router.push("/login");
  }, [router, mutateAsync]);
  return <div>page</div>;
};

export default LogoutPage;
