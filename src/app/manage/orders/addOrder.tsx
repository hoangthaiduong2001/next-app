"use client";
import Quantity from "@/app/guest/menu/quantity";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn, formatCurrency, handleErrorApi } from "@/config/utils";
import { DishStatus } from "@/constants/type";
import { useGetListDish } from "@/hooks/useDish";
import { useCreateGuestMutation } from "@/hooks/useGuest";
import { useCreateOrderMutation } from "@/hooks/useOrder";
import { toast } from "@/hooks/useToast";
import { GetListGuestsResType } from "@/schemaValidations/account.schema";
import { DishListResType } from "@/schemaValidations/dish.schema";
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from "@/schemaValidations/guest.schema";
import { CreateOrdersBodyType } from "@/schemaValidations/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import TableGuest from "./component/tableGuest";
import { TablesOfTable } from "./component/tablesOfTable";

export default function AddOrder() {
  const [open, setOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<
    GetListGuestsResType["data"][0] | null
  >(null);
  const [isNewGuest, setIsNewGuest] = useState(true);
  const [orders, setOrders] = useState<CreateOrdersBodyType["orders"]>([]);
  const { data } = useGetListDish();
  const dishes: DishListResType["data"] = data?.response.data ?? [];
  const createOrder = useCreateOrderMutation();
  const createGuest = useCreateGuestMutation();
  const totalPrice = useMemo(() => {
    return dishes.reduce((result, dish) => {
      const order = orders.find((order) => order.dishId === dish.id);
      if (!order) return result;
      return result + order.quantity * dish.price;
    }, 0);
  }, [dishes, orders]);

  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: "",
      tableNumber: 0,
    },
  });
  const { control, watch, setError } = form;
  const { name, tableNumber } = watch();

  const handleQuantityChange = (dishId: number, quantity: number) => {
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

  const handleOrder = async () => {
    let guestId = selectedGuest?.id;
    if (isNewGuest) {
      try {
        const data = await createGuest.mutateAsync({ name, tableNumber });
        if (data) {
          guestId = data.response.data.id;
        }
      } catch (error) {
        handleErrorApi({ error, setError });
        return;
      }
    }
    if (!guestId) {
      toast({ description: "Please select a guest" });
      return;
    }
    try {
      const orderData = await createOrder.mutateAsync({
        guestId: Number(guestId),
        orders,
      });
      toast({ description: orderData.response.message });
    } catch (error) {
      handleErrorApi({ error, setError });
    }
    reset();
  };

  const reset = () => {
    form.reset();
    setOrders([]);
    setSelectedGuest(null);
    setIsNewGuest(true);
    setOpen(false);
  };

  return (
    <Dialog
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
        setOpen(value);
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Create order
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Create order</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
          <Label htmlFor="isNewGuest">New customer</Label>
          <div className="col-span-3 flex items-center">
            <Switch
              id="isNewGuest"
              checked={isNewGuest}
              onCheckedChange={setIsNewGuest}
            />
          </div>
        </div>
        {isNewGuest && (
          <Form {...form}>
            <form
              noValidate
              className="grid auto-rows-max items-start gap-4 md:gap-8"
              id="add-employee-form"
            >
              <div className="grid gap-4 py-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="name">Name customer</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input
                            id="name"
                            className="w-full"
                            value={value}
                            onChange={onChange}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="tableNumber"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="tableNumber">Choose table</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <div className="flex items-center gap-4">
                            <div>{value}</div>
                            <TablesOfTable
                              onChoose={(table) => {
                                onChange(table.number);
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        )}
        {!isNewGuest && (
          <TableGuest
            onChoose={(guest) => {
              setSelectedGuest(guest);
            }}
          />
        )}
        {!isNewGuest && selectedGuest && (
          <div className="grid grid-cols-4 items-center justify-items-start gap-4">
            <Label htmlFor="selectedGuest">Guest selected</Label>
            <div className="col-span-3 w-full gap-4 flex items-center">
              <div>
                {selectedGuest.name} (#{selectedGuest.id})
              </div>
              <div>Table: {selectedGuest.tableNumber}</div>
            </div>
          </div>
        )}
        <div className="h-[50vh] overflow-y-scroll">
          {dishes
            .filter((dish) => dish.status !== DishStatus.Hidden)
            .map((dish) => (
              <div
                key={dish.id}
                className={cn("flex gap-4 mb-4", {
                  "h-[100px] pointer-events-none":
                    dish.status === DishStatus.Unavailable,
                })}
              >
                <div className="flex-shrink-0 relative">
                  {dish.status === DishStatus.Unavailable && (
                    <span className="absolute inset-0 flex items-center justify-center text-sm">
                      Out of stock
                    </span>
                  )}
                  <Image
                    src={dish.image}
                    alt={dish.name}
                    height={100}
                    width={100}
                    quality={100}
                    className="object-cover w-[80px] h-[80px] rounded-md"
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
                    onChange={(value) => handleQuantityChange(dish.id, value)}
                    value={
                      orders.find((order) => order.dishId === dish.id)
                        ?.quantity ?? 0
                    }
                  />
                </div>
              </div>
            ))}
        </div>
        <DialogFooter>
          <Button
            className="w-full justify-between"
            onClick={handleOrder}
            disabled={orders.length === 0}
          >
            <span>Order · {orders.length} dish</span>
            <span>{formatCurrency(totalPrice)}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
