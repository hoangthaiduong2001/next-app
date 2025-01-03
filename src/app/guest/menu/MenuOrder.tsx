"use client";

import { Button } from "@/components/ui/button";
import { cn, formatCurrency, handleErrorApi } from "@/config/utils";
import { DishStatus } from "@/constants/type";
import { useGetListDish } from "@/hooks/useDish";
import { useGuestOrderMutation } from "@/hooks/useGuest";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import Quantity from "./quantity";

const MenuOrder = () => {
  const [orders, setOrders] = useState<GuestCreateOrdersBodyType>([]);
  const { data } = useGetListDish();
  const { mutate: guestOrder } = useGuestOrderMutation();
  const router = useRouter();
  const dishes = data?.response.data || [];
  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id);
      if (!order) return result;
      return result + dish.price * order.quantity;
    }, 0);
  }, [dishes, orders]);
  const handleChangeQuantity = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dishId !== dishId);
      }
      const index = prevOrders.findIndex((order) => order.dishId === dishId);
      if (index === -1) {
        return [...prevOrders, { dishId, quantity }];
      }
      const newOrders = [...prevOrders];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };
  const handleOrder = (value: GuestCreateOrdersBodyType) => {
    guestOrder(value, {
      onSuccess: () => {
        router.push("/guest/orders");
      },
      onError: (error) => {
        handleErrorApi({ error });
      },
    });
  };
  return (
    <div>
      {dishes
        .filter((dish) => dish.status !== DishStatus.Hidden)
        .map((dish) => (
          <div
            key={dish.id}
            className={cn("flex gap-4", {
              "pointer-events-none": dish.status === DishStatus.Unavailable,
            })}
          >
            <div className="flex-shrink-0 relative">
              {dish.status === DishStatus.Unavailable && (
                <span className="absolute inset-0 flex items-center justify-center text-sm text-red-600">
                  Out of stock
                </span>
              )}
              <Image
                src={dish.image}
                alt={dish.name}
                height={100}
                width={100}
                quality={100}
                className={cn("object-cover w-[80px] h-[80px] rounded-md", {
                  "opacity-40": dish.status === DishStatus.Unavailable,
                })}
                unoptimized
              />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm">{dish.name}</h3>
              <p className="text-xs">{dish.description}</p>
              <p className="text-xs font-semibold">
                {formatCurrency(dish.price)}
              </p>
            </div>
            <div className="flex-shrink-0 ml-auto flex justify-center items-center">
              <Quantity
                value={
                  orders.find((order) => order.dishId === dish.id)?.quantity ??
                  0
                }
                onChange={(value) => handleChangeQuantity(dish.id, value)}
              />
            </div>
          </div>
        ))}
      <div className="sticky pt-6">
        <Button
          className="w-full justify-between"
          onClick={() => handleOrder(orders)}
        >
          <span>Order · {orders.length} dish</span>
          <span>{formatCurrency(totalPrice)}</span>
        </Button>
      </div>
    </div>
  );
};

export default MenuOrder;
