"use client";

import DatePicker from "@/app/manage/orders/component/DatePicker";
import FilterTableOrder from "@/app/manage/orders/component/FilterTableOrder";
import { initFromDate, initToDate } from "@/app/manage/orders/const";
import { useOrderService } from "@/app/manage/orders/orderService";
import OrderStatics from "@/app/manage/orders/orderStatics";
import TableSkeleton from "@/components/component/table/tableSkeleton";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { handleErrorApi } from "@/config/utils";
import { toast } from "@/hooks/useToast";
import { GetOrdersResType } from "@/schemaValidations/order.schema";
import { IPlainObject } from "@/types/common";
import {
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from "@tanstack/react-table";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import AutoPagination from "../autoPagination";
import CommonAlertDialog from "../CommonAlertDialog";
import { PAGE_SIZE } from "./const";
import { handleOrderSocket } from "./helper";
import { IItemTableContext, TTableProps } from "./type";

const CommonTable = <TRowDataType extends IPlainObject>({
  data,
  columns,
  tableContext,
  mutationItem,
  AddItem,
  EditItem,
  name,
  pathname,
  filterName,
  deleteById = true,
  isOrder = false,
  queryListItem,
}: TTableProps<TRowDataType>) => {
  const searchParam = useSearchParams();
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;
  const [itemIdEdit, setItemIdEdit] = useState<number | undefined>();
  const [openStatusFilter, setOpenStatusFilter] = useState(false);
  const [itemDelete, setItemDelete] = useState<IPlainObject | null>(null);
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE,
  });
  const tableList = queryListItem.data?.response.data ?? [];
  const tableListSortedByNumber = tableList.sort((a, b) => a.number - b.number);
  const { statics, orderObjectByGuestId, servingGuestByTableNumber } =
    useOrderService(
      (queryListItem.data?.response
        .data as unknown as GetOrdersResType["data"]) ?? []
    );
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  const handleDeleteItem = () => {
    if (itemDelete) {
      mutationItem(deleteById ? itemDelete.id : itemDelete.number, {
        onSuccess: (data) => {
          setItemDelete(null);
          toast({
            title: data.response.message,
          });
        },
        onError: (error) => {
          handleErrorApi({ error });
        },
      });
    }
  };

  useEffect(() => {
    table.setPagination({
      pageIndex,
      pageSize: PAGE_SIZE,
    });
  }, [table, pageIndex]);

  useEffect(() => {
    if (isOrder) {
      handleOrderSocket<TRowDataType>(fromDate, toDate, queryListItem);
    }
    return;
  }, [queryListItem.refetch]);
  return (
    <tableContext.Provider
      value={
        {
          itemIdEdit,
          itemDelete,
          setItemDelete,
          setItemIdEdit,
        } as IItemTableContext<TRowDataType>
      }
    >
      <div className="w-full">
        <EditItem id={itemIdEdit} setId={setItemIdEdit} />
        {isOrder && (
          <CommonAlertDialog<TRowDataType>
            name={name}
            itemDelete={itemDelete as TRowDataType}
            setItemDelete={setItemDelete}
            handleSubmit={handleDeleteItem}
          />
        )}
        {isOrder ? (
          <>
            <div className=" flex items-center">
              <DatePicker
                toDate={toDate}
                fromDate={fromDate}
                setToDate={setToDate}
                setFromDate={setFromDate}
              />
              <div className="ml-auto">
                <AddItem />
              </div>
            </div>
            <FilterTableOrder
              table={table}
              openStatusFilter={openStatusFilter}
              setOpenStatusFilter={setOpenStatusFilter}
            />
            <OrderStatics
              statics={statics}
              tableList={tableListSortedByNumber as any}
              servingGuestByTableNumber={servingGuestByTableNumber}
            />
          </>
        ) : (
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter name"
              value={
                (table.getColumn(filterName)?.getFilterValue() as string) ?? ""
              }
              onChange={(e) =>
                table.getColumn(filterName)?.setFilterValue(e.target.value)
              }
              className="max-w-sm"
            />
            <div className="ml-auto flex items-center gap-2">{<AddItem />}</div>
          </div>
        )}
        {queryListItem.isPending ? (
          <TableSkeleton />
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      );
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}

        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-xs text-muted-foreground py-4 flex-1 ">
            Display <strong>{table.getPaginationRowModel().rows.length}</strong>{" "}
            in <strong>{data.length}</strong> result
          </div>
          <div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname={pathname}
            />
          </div>
        </div>
      </div>
    </tableContext.Provider>
  );
};

export default CommonTable;
