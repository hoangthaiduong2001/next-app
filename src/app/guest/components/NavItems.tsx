import { IMenuItem } from "@/app/(public)/type";
import Link from "next/link";

const menuItems: IMenuItem[] = [
  {
    title: "Menu",
    href: "/guest/menu",
    authRequired: true,
  },
  {
    title: "Order",
    href: "/guest/orders",
    authRequired: true,
  },
];

export default function NavItems({
  className,
  isAuth,
}: {
  className?: string;
  isAuth?: boolean;
}) {
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
