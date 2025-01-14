"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  formatCurrency,
  formatDateTimeToLocaleString,
  OrderStatusIcon,
} from "@/config/utils";
import { OrderStatus } from "@/constants/type";

import { GetOrdersResType } from "@/schemaValidations/order.schema";
import Image from "next/image";
import { Fragment } from "react";

type Guest = GetOrdersResType["data"][0]["guest"];
type Orders = GetOrdersResType["data"];
export default function OrderGuestDetail({
  guest,
  orders,
}: {
  guest: Guest;
  orders: Orders;
}) {
  const ordersFilterToPurchase = guest
    ? orders.filter(
        (order) =>
          order.status !== OrderStatus.Paid &&
          order.status !== OrderStatus.Rejected
      )
    : [];
  const purchasedOrderFilter = guest
    ? orders.filter((order) => order.status === OrderStatus.Paid)
    : [];
  return (
    <div className="space-y-2 text-sm">
      {guest && (
        <Fragment>
          <div className="space-x-1">
            <span className="font-semibold">Name:</span>
            <span>{guest.name}</span>
            <span className="font-semibold">(#{guest.id})</span>
            <span>|</span>
            <span className="font-semibold">Table:</span>
            <span>{guest.tableNumber}</span>
          </div>
          <div className="space-x-1">
            <span className="font-semibold">Registration date:</span>
            <span>{formatDateTimeToLocaleString(guest.createdAt)}</span>
          </div>
        </Fragment>
      )}

      <div className="space-y-1">
        <div className="font-semibold">Order:</div>
        {orders.map((order, index) => {
          return (
            <div key={order.id} className="flex gap-2 items-center text-xs">
              <span className="w-[10px]">{index + 1}</span>
              <span title={order.status}>
                {order.status === OrderStatus.Pending && (
                  <OrderStatusIcon.Pending className="w-4 h-4" />
                )}
                {order.status === OrderStatus.Processing && (
                  <OrderStatusIcon.Processing className="w-4 h-4" />
                )}
                {order.status === OrderStatus.Rejected && (
                  <OrderStatusIcon.Rejected className="w-4 h-4 text-red-400" />
                )}
                {order.status === OrderStatus.Delivered && (
                  <OrderStatusIcon.Delivered className="w-4 h-4" />
                )}
                {order.status === OrderStatus.Paid && (
                  <OrderStatusIcon.Paid className="w-4 h-4 text-yellow-400" />
                )}
              </span>
              <Image
                src={order.dishSnapshot.image}
                alt={order.dishSnapshot.name}
                title={order.dishSnapshot.name}
                width={30}
                height={30}
                className="h-[30px] w-[30px] rounded object-cover"
                unoptimized
              />
              <span
                className="truncate w-[70px] sm:w-[100px]"
                title={order.dishSnapshot.name}
              >
                {order.dishSnapshot.name}
              </span>
              <span className="font-semibold" title={`Tổng: ${order.quantity}`}>
                x{order.quantity}
              </span>
              <span className="italic">
                {formatCurrency(order.quantity * order.dishSnapshot.price)}
              </span>
              <span
                className="hidden sm:inline"
                title={`Create: ${formatDateTimeToLocaleString(
                  order.createdAt
                )} | Update: ${formatDateTimeToLocaleString(order.updatedAt)}
          `}
              >
                {formatDateTimeToLocaleString(order.createdAt)}
              </span>
              <span
                className="sm:hidden"
                title={`Create: ${formatDateTimeToLocaleString(
                  order.createdAt
                )} | Update: ${formatDateTimeToLocaleString(order.updatedAt)}
          `}
              >
                {formatDateTimeToLocaleString(order.createdAt)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="space-x-1">
        <span className="font-semibold">Unpaid:</span>
        <Badge>
          <span>
            {formatCurrency(
              ordersFilterToPurchase.reduce((acc, order) => {
                return acc + order.quantity * order.dishSnapshot.price;
              }, 0)
            )}
          </span>
        </Badge>
      </div>
      <div className="space-x-1">
        <span className="font-semibold">Paid:</span>
        <Badge variant={"outline"}>
          <span>
            {formatCurrency(
              purchasedOrderFilter.reduce((acc, order) => {
                return acc + order.quantity * order.dishSnapshot.price;
              }, 0)
            )}
          </span>
        </Badge>
      </div>

      <div>
        <Button
          className="w-full"
          size={"sm"}
          variant={"secondary"}
          disabled={ordersFilterToPurchase.length === 0}
        >
          Pay all ({ordersFilterToPurchase.length} order)
        </Button>
      </div>
    </div>
  );
}
