"use client";
import { TableDish } from "@/app/manage/orders/component/tableDish";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OrderStatus, OrderStatusValues } from "@/constants/type";
import { DishListResType } from "@/schemaValidations/dish.schema";
import {
  UpdateOrderBody,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";

const fakeOrderDetail = {
  id: 30,
  guestId: 70,
  guest: {
    id: 70,
    name: "An",
    tableNumber: 2,
    createdAt: "2024-07-11T04:30:32.728Z",
    updatedAt: "2024-07-11T05:00:34.131Z",
  },
  tableNumber: 2,
  dishSnapshotId: 36,
  dishSnapshot: {
    id: 36,
    name: "Spaghetti 5",
    price: 50000,
    image: "http://localhost:4000/static/e0001b7e08604e0dbabf0d8f95e6174a.jpg",
    description: "Mỳ ý",
    status: "Available",
    dishId: 2,
    createdAt: "2024-07-11T04:30:57.450Z",
    updatedAt: "2024-07-11T04:30:57.450Z",
  },
  quantity: 1,
  orderHandlerId: null,
  orderHandler: null,
  status: "Paid",
  createdAt: "2024-07-11T04:30:57.450Z",
  updatedAt: "2024-07-11T04:31:38.806Z",
  table: {
    number: 2,
    capacity: 10,
    status: "Reserved",
    token: "667f3b1ce5e4429990dacea1809d20e7",
    createdAt: "2024-06-21T06:52:26.847Z",
    updatedAt: "2024-07-03T04:36:51.130Z",
  },
};

export default function EditOrder({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const [selectedDish, setSelectedDish] = useState<DishListResType["data"][0]>(
    fakeOrderDetail.dishSnapshot as any
  );
  const orderDetail = fakeOrderDetail;
  const form = useForm<UpdateOrderBodyType>({
    resolver: zodResolver(UpdateOrderBody),
    defaultValues: {
      status: OrderStatus.Pending,
      dishId: 0,
      quantity: 1,
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (values: UpdateOrderBodyType) => {};

  const reset = () => {
    setId(undefined);
  };

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Update order</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-order-form"
            onSubmit={handleSubmit(onSubmit, console.log)}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={control}
                name="dishId"
                render={({ field: { onChange } }) => (
                  <FormItem className="grid grid-cols-4 items-center justify-items-start gap-4">
                    <FormLabel>Dish</FormLabel>
                    <div className="flex items-center col-span-2 space-x-4">
                      <Avatar className="aspect-square w-[50px] h-[50px] rounded-md object-cover">
                        <AvatarImage src={selectedDish?.image} />
                        <AvatarFallback className="rounded-none">
                          {selectedDish?.name}
                        </AvatarFallback>
                      </Avatar>
                      <div>{selectedDish?.name}</div>
                    </div>
                    <TableDish
                      onChoose={(dish) => {
                        onChange(dish.id);
                        setSelectedDish(dish);
                      }}
                    />
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="quantity"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="quantity">Quantity</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="quantity"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          className="w-16 text-center"
                          value={value}
                          onChange={(e) => {
                            let value = e.target.value;
                            const numberValue = Number(value);
                            if (isNaN(numberValue)) {
                              return;
                            }
                            onChange(numberValue);
                          }}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="status"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <FormLabel>Status</FormLabel>
                      <Select onValueChange={onChange} value={value}>
                        <FormControl className="col-span-3">
                          <SelectTrigger className="w-[200px]">
                            <SelectValue placeholder="Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {OrderStatusValues.map((status) => (
                            <SelectItem key={status} value={status}>
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-order-form">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
