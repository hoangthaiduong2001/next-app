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
import { DishTableContext } from "./const";
import EditDish from "./editDish";
import { DishItem } from "./type";

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
              <CommonTable<DishItem>
                AddItem={AddDish}
                EditItem={EditDish}
                tableContext={DishTableContext as unknown as Context<DishItem>}
                data={data}
                columns={columnsDish}
                mutationItem={deleteDish}
                name="Dish"
                pathname="/manage/dishes"
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
