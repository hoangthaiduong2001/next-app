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
import { handleErrorApi } from "@/config/utils";
import { OrderStatus, OrderStatusValues } from "@/constants/type";
import {
  useGetOrderDetailQuery,
  useUpdateOrderMutation,
} from "@/hooks/useOrder";
import { toast } from "@/hooks/useToast";
import { DishListResType } from "@/schemaValidations/dish.schema";
import {
  UpdateOrderBody,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

export default function EditOrder({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const [selectedDish, setSelectedDish] = useState<
    DishListResType["data"][0] | null
  >(null);
  const { mutate: updateOrder, status } = useUpdateOrderMutation();
  const data = useGetOrderDetailQuery({
    orderId: Number(id),
    enabled: Boolean(id),
  }).data;
  const form = useForm<UpdateOrderBodyType>({
    resolver: zodResolver(UpdateOrderBody),
    defaultValues: {
      status: OrderStatus.Pending,
      dishId: 0,
      quantity: 1,
    },
  });

  const { control, handleSubmit, setError } = form;

  const onSubmit = async (values: UpdateOrderBodyType) => {
    if (status === "pending") return;
    let body: UpdateOrderBodyType & { orderId: number } = {
      orderId: Number(id),
      ...values,
    };
    updateOrder(body, {
      onSuccess: (data) => {
        toast({ description: data.response.message });
        reset();
        onSubmitSuccess?.();
      },
      onError: (error) => {
        handleErrorApi({ error, setError });
      },
    });
  };

  const reset = () => {
    setId(undefined);
  };

  useEffect(() => {
    if (data) {
      const {
        status,
        dishSnapshot: { dishId },
        quantity,
      } = data.response.data;
      form.reset({ status, dishId: dishId ?? 0, quantity });
      setSelectedDish(data?.response.data.dishSnapshot);
    }
  }, [data, form]);

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
