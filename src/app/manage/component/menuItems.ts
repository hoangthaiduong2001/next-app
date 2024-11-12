import { pathApp } from "@/routes/path";
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
    href: pathApp.manage.dashboard,
  },
  {
    title: "Order",
    Icon: ShoppingCart,
    href: pathApp.manage.oder,
  },
  {
    title: "Table",
    Icon: Table,
    href: pathApp.manage.table,
  },
  {
    title: "Dish",
    Icon: Salad,
    href: pathApp.manage.dish,
  },

  {
    title: "Analytic",
    Icon: LineChart,
    href: pathApp.manage.analytic,
  },
  {
    title: "Accounts",
    Icon: Users2,
    href: pathApp.manage.accounts,
  },
];

export default menuItems;
