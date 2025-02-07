import CommonTable from "@/components/component/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetListDish } from "@/hooks/useDish";

import { useState } from "react";
import { columnDish } from "../column";
import { DishTableContext } from "../const";
import { TDish } from "../type";

export function TableDish({ onChoose }: { onChoose: (dish: TDish) => void }) {
  const [open, setOpen] = useState(false);
  const listDish = useGetListDish();
  const data = listDish.data?.response.data ?? [];

  const chooseDish = (dish: TDish) => {
    onChoose(dish);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Change</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Choose dish</DialogTitle>
        </DialogHeader>
        <div className="h-[75vh]">
          <CommonTable<TDish>
            tableContext={DishTableContext}
            AddItem={() => null}
            EditItem={() => null}
            onChoose={chooseDish}
            data={data}
            columns={columnDish}
            name="dish"
            isLink
            filterName="dishName"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
