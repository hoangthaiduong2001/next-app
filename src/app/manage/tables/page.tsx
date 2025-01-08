"use client";

import CommonTable from "@/components/component/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDeleteTable, useGetListTable } from "@/hooks/useTable";
import { Context, Suspense } from "react";
import AddTable from "./addTable";
import { columnsTable } from "./column";
import { TableContext } from "./const";
import EditTable from "./editTable";
import { TableItem } from "./type";

export default function TablesPage() {
  const tableList = useGetListTable();
  const { mutate: deleteTable } = useDeleteTable();
  const data = tableList.data?.response.data || [];
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Table</CardTitle>
            <CardDescription>Management table</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <CommonTable<TableItem>
                AddItem={AddTable}
                EditItem={EditTable}
                tableContext={TableContext as unknown as Context<TableItem>}
                data={data}
                columns={columnsTable}
                mutationItem={deleteTable}
                name="Table"
                pathname="/manage/tables"
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
