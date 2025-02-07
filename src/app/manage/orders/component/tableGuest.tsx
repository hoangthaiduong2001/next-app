import CommonTable from "@/components/component/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetGuestListQuery } from "@/hooks/useGuest";
import { GetListGuestsResType } from "@/schemaValidations/account.schema";
import { useState } from "react";
import { columnGuest } from "../column";
import { GuestTableContext, initFromDate, initToDate } from "../const";
import { TGuest } from "../type";

export default function TableGuest({
  onChoose,
}: {
  onChoose: (guest: TGuest) => void;
}) {
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);
  const guestList = useGetGuestListQuery({
    fromDate: initFromDate,
    toDate: initToDate,
  });
  const data: GetListGuestsResType["data"] =
    guestList.data?.response.data ?? [];

  const chooseGuest = (guest: TGuest) => {
    onChoose(guest);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Select guests</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-full overflow-auto">
        <DialogHeader>
          <DialogTitle>Select guests</DialogTitle>
        </DialogHeader>
        <div className="h-[75vh]">
          <CommonTable<TGuest>
            tableContext={GuestTableContext}
            AddItem={() => null}
            EditItem={() => null}
            onChoose={chooseGuest}
            data={data}
            filterDatePicker
            columns={columnGuest}
            queryItemByDate={{ fromDate, toDate, setFromDate, setToDate }}
            name="Guest"
            isLink
            filterName="name"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
