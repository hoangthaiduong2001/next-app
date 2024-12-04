"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getVietnameseTableStatus } from "@/config/utils";
import { TableStatusValues } from "@/constants/type";
import {
  CreateTableBody,
  CreateTableBodyType,
} from "@/schemaValidations/table.schema";
import { defaultValueAddable } from "./const";

export default function AddTable() {
  const [open, setOpen] = useState(false);
  const form = useForm<CreateTableBodyType>({
    resolver: zodResolver(CreateTableBody),
    defaultValues: defaultValueAddable,
  });
  const { control, reset, handleSubmit } = form;
  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add table
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        className="sm:max-w-[600px] max-h-screen overflow-auto"
        onCloseAutoFocus={() => reset()}
      >
        <DialogHeader>
          <DialogTitle>Add table</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="add-table-form"
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={control}
                name="number"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Table ID</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="number"
                          type="number"
                          className="w-full"
                          value={value}
                          onChange={(e) => {
                            if (Number(e.target.value) >= 0) {
                              onChange(e.target.value);
                            }
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
                name="capacity"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Number of guests allowed</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="capacity"
                          className="w-full"
                          type="text"
                          value={value}
                          onChange={(e) => {
                            if (
                              (Number(e.target.value) > 0 &&
                                typeof Number(e.target.value) === "number") ||
                              e.target.value === ""
                            ) {
                              onChange(e.target.value);
                            }
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
                      <Label htmlFor="description">Status</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select onValueChange={onChange} defaultValue={value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TableStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getVietnameseTableStatus(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="add-table-form">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
