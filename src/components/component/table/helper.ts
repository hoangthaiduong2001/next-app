import { toast } from "@/hooks/useToast";
import socket from "@/lib/socket";
import { GuestCreateOrdersResType } from "@/schemaValidations/guest.schema";
import { UpdateOrderResType } from "@/schemaValidations/order.schema";
import { IPlainObject } from "@/types/common";
import { UseQueryResult } from "@tanstack/react-query";
import { TData } from "./type";

export const handleOrderSocket = <T extends IPlainObject>(
  fromDate: Date,
  toDate: Date,
  queryListItem: UseQueryResult<TData<T[]>>
) => {
  if (socket.connected) {
    onConnect();
  }

  function onConnect() {
    console.log(socket.id);
  }

  function onDisconnect() {
    console.log("disconnect");
  }

  function refetch() {
    const now = new Date();
    if (now >= fromDate && now <= toDate) {
      queryListItem.refetch();
    }
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

  function onNewOrder(data: GuestCreateOrdersResType["data"]) {
    const { guest } = data[0];
    toast({
      description: `${guest?.name} at table ${guest?.tableNumber} reversed`,
    });
    refetch();
  }

  socket.on("connect", onConnect);
  socket.on("disconnect", onDisconnect);
  socket.on("update-order", onUpdateOrder);
  socket.on("new-order", onNewOrder);

  return () => {
    socket.off("connect", onConnect);
    socket.off("disconnect", onDisconnect);
    socket.off("update-order", onUpdateOrder);
    socket.off("new-order", onNewOrder);
  };
};
