"use client";

import Link from "next/link";
import { IMenuItem } from "./login/type";

const menuItems: IMenuItem[] = [
  {
    title: "Dish",
    href: "/menu",
  },
  {
    title: "Order",
    href: "/orders",
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
  return menuItems.map((item) => {
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
