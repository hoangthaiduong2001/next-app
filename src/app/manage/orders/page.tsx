"use client";

import CommonTable from "@/components/component/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { TChangeStatusOrder } from "@/components/component/table/type";
import { handleErrorApi } from "@/config/utils";
import { useGetOrderListQuery, useUpdateOrderMutation } from "@/hooks/useOrder";
import { useGetListTable } from "@/hooks/useTable";
import { toast } from "@/hooks/useToast";
import { TableListResType } from "@/schemaValidations/table.schema";
import { Suspense, useState } from "react";
import AddOrder from "./addOrder";
import { columnOrders } from "./column";
import { initFromDate, initToDate, OrderTableContext } from "./const";
import EditOrder from "./editOrder";
import { TOrders } from "./type";

export default function OrdersPage() {
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);
  const getTableList = useGetListTable();
  const { mutate: updateOrder } = useUpdateOrderMutation();
  const getOrderListQuery = useGetOrderListQuery({ fromDate, toDate });
  const data = getOrderListQuery.data?.response.data ?? [];
  const tableList = getTableList.data?.response.data ?? [];
  const tableListSortedByNumber = tableList.sort((a, b) => a.number - b.number);
  const changeStatus = async (body: TChangeStatusOrder) => {
    updateOrder(body, {
      onSuccess: (data) => {
        toast({ description: data.response.message });
      },
      onError: (error) => {
        handleErrorApi({
          error,
        });
      },
    });
  };
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Order</CardTitle>
            <CardDescription>Order management</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <CommonTable<TOrders, TableListResType["data"]>
                AddItem={AddOrder}
                EditItem={EditOrder}
                tableContext={OrderTableContext}
                data={data}
                changeStatus={changeStatus}
                columns={columnOrders}
                queryListItem={getOrderListQuery}
                tableListSortedByNumber={tableListSortedByNumber}
                queryItemByDate={{ fromDate, toDate, setFromDate, setToDate }}
                isOrder
                name="Order"
                pathname="/manage/orders"
                filterName="name"
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
