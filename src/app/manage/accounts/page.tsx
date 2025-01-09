"use client";

import CommonTable from "@/components/component/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useDeleteAccount, useGetListAccount } from "@/hooks/useAccount";
import { Context, Suspense } from "react";
import AddAccount from "./addAccount";
import { columnsAccount } from "./column";
import { AccountTableContext } from "./const";
import EditAccount from "./editAccount";
import { AccountItem } from "./type";

export default function Dashboard() {
  const accountList = useGetListAccount();
  const { mutate: deleteAccount } = useDeleteAccount();
  const data = accountList.data?.response.data || [];
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card x-chunk="dashboard-06-chunk-0">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Management account employee</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <CommonTable<AccountItem>
                AddItem={AddAccount}
                EditItem={EditAccount}
                tableContext={
                  AccountTableContext as unknown as Context<AccountItem>
                }
                data={data}
                columns={columnsAccount}
                mutationItem={deleteAccount}
                name="Account"
                pathname="/manage/accounts"
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
