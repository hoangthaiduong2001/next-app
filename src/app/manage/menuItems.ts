import {
  Home,
  LineChart,
  Salad,
  ShoppingCart,
  Table,
  Users2,
} from "lucide-react";

const menuItems = [
  {
    title: "Dashboard",
    Icon: Home,
    href: "/manage/dashboard",
  },
  {
    title: "Order",
    Icon: ShoppingCart,
    href: "/manage/orders",
  },
  {
    title: "Table",
    Icon: Table,
    href: "/manage/tables",
  },
  {
    title: "Dish",
    Icon: Salad,
    href: "/manage/dishes",
  },

  {
    title: "Analytic",
    Icon: LineChart,
    href: "/manage/analytics",
  },
  {
    title: "Staff",
    Icon: Users2,
    href: "/manage/staffs",
  },
];

export default menuItems;
