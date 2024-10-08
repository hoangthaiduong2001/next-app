"use client";

import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IMenuItem } from "./login/type";

const menuItems: IMenuItem[] = [
  {
    title: "Dish",
    href: "/menu",
  },
  {
    title: "Order",
    href: "/orders",
    authRequired: true,
  },
  {
    title: "Login",
    href: "/login",
    authRequired: false,
  },
  {
    title: "Management",
    href: "/manage/dashboard",
    authRequired: true,
  },
];

export default function NavItems({ className }: { className?: string }) {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  useEffect(() => {
    setIsAuth(Boolean(getAccessTokenFromLocalStorage()));
  }, []);
  return menuItems.map((item) => {
    if (
      (item.authRequired === false && isAuth) ||
      (item.authRequired === true && !isAuth)
    )
      return null;
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
