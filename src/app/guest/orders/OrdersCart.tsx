"use client";

import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/config/utils";
import { useGuestGetOrderList } from "@/hooks/useGuest";
import { toast } from "@/hooks/useToast";
import socket from "@/lib/socket";
import { UpdateOrderResType } from "@/schemaValidations/order.schema";
import Image from "next/image";
import { useEffect, useMemo } from "react";

const OrdersCart = () => {
  const { data, refetch } = useGuestGetOrderList();
  const orders = data?.response.data ?? [];
  const totalPrice = useMemo(() => {
    return orders.reduce((result, order) => {
      return result + order.dishSnapshot.price * order.quantity;
    }, 0);
  }, [orders]);
  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log(socket.id);
    }

    function onDisconnect() {
      console.log("disconnect");
    }

    function onUpdateOrder(data: UpdateOrderResType["data"]) {
      const {
        dishSnapshot: { name },
        quantity,
      } = data;
      toast({
        description: `Dish ${name} updated quantity: ${quantity} with status "${data.status}"`,
      });
      refetch();
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("update-order", onUpdateOrder);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("update-order", onUpdateOrder);
    };
  }, []);
  return (
    <>
      {orders.map((order, index) => (
        <div key={order.id} className="flex gap-4">
          <div className="flex gap-5 relative items-center justify-center">
            <p className="text-sm font-semibold">{index + 1}</p>
            <Image
              src={order.dishSnapshot.image}
              alt={order.dishSnapshot.name}
              height={100}
              width={100}
              quality={100}
              className="object-cover w-[80px] h-[80px] rounded-md"
              unoptimized
            />
          </div>
          <div className="space-y-1 flex flex-col justify-center">
            <h3 className="text-sm">{order.dishSnapshot.name}</h3>
            <div className="text-xs font-semibold">
              {formatCurrency(order.dishSnapshot.price)} x{" "}
              <Badge className="px-1 py-0">{order.quantity}</Badge>
            </div>
          </div>
          <div className="flex-shrink-0 ml-auto flex justify-center items-center">
            <Badge variant="outline">{order.status}</Badge>
          </div>
        </div>
      ))}
      <div className="sticky bottom-0">
        <div className="w-full flex space-x-4 text-xl font-semibold">
          <span>Total &bull; {orders.length} dish</span>
          <span>{formatCurrency(totalPrice)}</span>
        </div>
      </div>
    </>
  );
};

export default OrdersCart;
