"use client";

import CommonTable from "@/components/component/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDeleteDish, useGetListDish } from "@/hooks/useDish";
import { Context, Suspense } from "react";
import AddDish from "./addDish";
import { columnsDish } from "./column";
import { DishItem, DishTableContext } from "./const";
import EditDish from "./editDish";

export default function DishesPage() {
  const dishList = useGetListDish();
  const { mutate: deleteDish } = useDeleteDish();
  const data = dishList.data?.response.data || [];
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Dish</CardTitle>
            <CardDescription>Management dish</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              {/* <DishTable /> */}
              <CommonTable<DishItem>
                AddItem={<AddDish />}
                EditItem={EditDish}
                tableContext={DishTableContext as unknown as Context<DishItem>}
                data={data}
                columns={columnsDish}
                mutationItem={deleteDish}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
