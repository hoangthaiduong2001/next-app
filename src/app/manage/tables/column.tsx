import QrCodeTable from "@/components/component/QrCodeTable";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdownMenu";
import { getVietnameseTableStatus } from "@/config/utils";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useContext } from "react";
import { TableContext } from "./const";
import { TableItem } from "./type";

export const columnsTable: ColumnDef<TableItem>[] = [
  {
    accessorKey: "number",
    header: "ID",
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("number")}</div>
    ),
    filterFn: (rows, columnId, filterValue) => {
      if (!filterValue) return true;
      return String(filterValue) === String(rows.getValue("number"));
    },
  },
  {
    accessorKey: "capacity",
    header: "Capacity",
    cell: ({ row }) => (
      <div className="capitalize text-center">{row.getValue("capacity")}</div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="text-center">
        {getVietnameseTableStatus(row.getValue("status"))}
      </div>
    ),
  },
  {
    accessorKey: "token",
    header: "QR Code",
    cell: ({ row }) => (
      <div className="inline-block">
        {
          <QrCodeTable
            token={row.getValue("token")}
            tableNumber={row.getValue("number")}
          />
        }
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setItemIdEdit, setItemDelete } = useContext(TableContext);
      const openEditTable = () => {
        setItemIdEdit(row.original.number);
      };

      const openDeleteTable = () => {
        setItemDelete(row.original);
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
            <DropdownMenuItem onClick={openEditTable}>Update</DropdownMenuItem>
            <DropdownMenuItem onClick={openDeleteTable}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
