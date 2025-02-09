import OrderGuestDetail from "@/app/manage/orders/orderGuestDetail";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  formatCurrency,
  formatDateTimeToLocaleString,
  simpleMatchText,
} from "@/config/utils";
import { OrderStatus, OrderStatusValues } from "@/constants/type";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { useContext } from "react";
import { OrderTableContext } from "./const";
import { TDish, TGuest, TOrders, TTable } from "./type";

export const columnOrders: ColumnDef<TOrders>[] = [
  {
    accessorKey: "tableNumber",
    header: "ID",
    cell: ({ row }) => <div>{row.getValue("tableNumber")}</div>,
    filterFn: (row, columnId, filterValue: string) => {
      if (filterValue === undefined) return true;
      return simpleMatchText(
        String(row.getValue(columnId)),
        String(filterValue)
      );
    },
  },
  {
    id: "guestName",
    header: "Customer",
    cell: function Cell({ row }) {
      const { orderObjectByGuestId } = useContext(OrderTableContext);
      const guest = row.original.guest;
      return (
        <div className="text-center">
          {!guest && (
            <div>
              <span>Deleted</span>
            </div>
          )}
          {guest && (
            <Popover>
              <PopoverTrigger>
                <div>
                  <span>{guest.name}</span>
                  <span className="font-semibold">(#{guest.id})</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] sm:w-[440px]">
                <OrderGuestDetail
                  guest={guest}
                  orders={orderObjectByGuestId?.[guest.id] ?? []}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      );
    },
    filterFn: (row, columnId, filterValue: string) => {
      if (filterValue === undefined) return true;
      return simpleMatchText(
        row.original.guest?.name ?? "Deleted",
        String(filterValue)
      );
    },
  },
  {
    id: "dishName",
    header: "Dish",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-2 ">
        <Popover>
          <PopoverTrigger asChild>
            <Image
              src={row.original.dishSnapshot.image}
              alt={row.original.dishSnapshot.name}
              width={50}
              height={50}
              className="rounded-md object-cover w-[50px] h-[50px] cursor-pointer"
              unoptimized
            />
          </PopoverTrigger>
          <PopoverContent>
            <div className="flex flex-wrap gap-2">
              <Image
                src={row.original.dishSnapshot.image}
                alt={row.original.dishSnapshot.name}
                width={100}
                height={100}
                className="rounded-md object-cover w-[100px] h-[100px]"
                unoptimized
              />
              <div className="space-y-1 text-sm">
                <h3 className="font-semibold">
                  {row.original.dishSnapshot.name}
                </h3>
                <div className="italic">
                  {formatCurrency(row.original.dishSnapshot.price)}
                </div>
                <div>{row.original.dishSnapshot.description}</div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <div className="w-1/2">
          <div className="flex items-center gap-2">
            <span>{row.original.dishSnapshot.name}</span>
            <Badge className="px-1" variant={"secondary"}>
              x{row.original.quantity}
            </Badge>
          </div>
          <span className="italic flex">
            {formatCurrency(
              row.original.dishSnapshot.price * row.original.quantity
            )}
          </span>
        </div>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: function Cell({ row }) {
      const { changeStatus } = useContext(OrderTableContext);
      const changeOrderStatus = async (
        status: (typeof OrderStatusValues)[number]
      ) => {
        changeStatus?.({
          orderId: row.original.id,
          dishId: row.original.dishSnapshot.dishId!,
          status: status,
          quantity: row.original.quantity,
        });
      };
      return (
        <div className="flex items-center justify-center">
          <Select
            onValueChange={(value: (typeof OrderStatusValues)[number]) => {
              changeOrderStatus(value);
            }}
            defaultValue={OrderStatus.Pending}
            value={row.getValue("status")}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Theme" />
            </SelectTrigger>
            <SelectContent>
              {OrderStatusValues.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );
    },
  },
  {
    id: "orderHandlerName",
    header: "Handler",
    cell: ({ row }) => (
      <div className="text-center">{row.original.orderHandler?.name ?? ""}</div>
    ),
  },
  {
    accessorKey: "createdAt",
    header: () => <div>Create/Update</div>,
    cell: ({ row }) => (
      <div className="space-y-2 text-sm">
        <div className="space-x-4">
          {formatDateTimeToLocaleString(row.getValue("createdAt"))}
        </div>
        <div className="space-x-4">
          {formatDateTimeToLocaleString(
            row.original.updatedAt as unknown as string
          )}
        </div>
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setItemIdEdit } = useContext(OrderTableContext);
      const openEditOrder = () => {
        setItemIdEdit(row.original.id);
      };

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={openEditOrder}>Update</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export const columnDish: ColumnDef<TDish>[] = [
  {
    id: "dishName",
    header: "Dish",
    cell: ({ row }) => (
      <div className="flex items-center space-x-4">
        <Image
          src={row.original.image}
          alt={row.original.name}
          width={50}
          height={50}
          className="rounded-md object-cover w-[50px] h-[50px]"
          unoptimized
        />
        <span>{row.original.name}</span>
      </div>
    ),
    filterFn: (row, columnId, filterValue: string) => {
      if (filterValue === undefined) return true;
      return simpleMatchText(String(row.original.name), String(filterValue));
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    cell: ({ row }) => (
      <div className="capitalize">{formatCurrency(row.getValue("price"))}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
];

export const columnTable: ColumnDef<TTable>[] = [
  {
    accessorKey: "number",
    header: "ID",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("number")}</div>
    ),
    filterFn: (row, columnId, filterValue: string) => {
      if (filterValue === undefined) return true;
      return simpleMatchText(String(row.original.number), String(filterValue));
    },
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("capacity")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div>{row.getValue("status")}</div>,
  },
];

export const columnGuest: ColumnDef<TGuest>[] = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("name")} | (#{row.original.id})
      </div>
    ),
    filterFn: (row, columnId, filterValue: string) => {
      if (filterValue === undefined) return true;
      return simpleMatchText(
        row.original.name + String(row.original.id),
        String(filterValue)
      );
    },
  },
  {
    accessorKey: "tableNumber",
    header: "ID",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("tableNumber")}</div>
    ),
    filterFn: (row, columnId, filterValue: string) => {
      if (filterValue === undefined) return true;
      return simpleMatchText(
        String(row.original.tableNumber),
        String(filterValue)
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div>Create</div>,
    cell: ({ row }) => (
      <div className="flex items-center space-x-4 text-sm">
        {formatDateTimeToLocaleString(row.getValue("createdAt"))}
      </div>
    ),
  },
];
