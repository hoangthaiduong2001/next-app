"use client";

import CommonTable from "@/components/component/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetListTable } from "@/hooks/useTable";
import { TableListResType } from "@/schemaValidations/table.schema";
import { useState } from "react";
import { columnTable } from "../column";
import { TableItemContext } from "../const";
import { TTable } from "../type";

export function TablesOfTable({
  onChoose,
}: {
  onChoose: (table: TTable) => void;
}) {
  const [open, setOpen] = useState(false);
  const tableList = useGetListTable();
  const data: TableListResType["data"] = tableList.data?.response.data ?? [];

  const chooseTable = (table: TTable) => {
    onChoose(table);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-full overflow-auto">
        <DialogHeader>
          <DialogTitle>Select table</DialogTitle>
        </DialogHeader>
        <div className="h-[75vh]">
          <CommonTable<TTable>
            tableContext={TableItemContext}
            AddItem={() => null}
            EditItem={() => null}
            onChoose={chooseTable}
            data={data}
            columns={columnTable}
            name="table"
            isLink
            filterName="number"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
