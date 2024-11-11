"use client";

import { useAppContext } from "@/components/AppProvider";
import Link from "next/link";
import { IMenuItem } from "./type";

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
  const { isAuth } = useAppContext();
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
