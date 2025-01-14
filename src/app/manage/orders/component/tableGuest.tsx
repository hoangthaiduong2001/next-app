import CommonTable from "@/components/component/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { GetListGuestsResType } from "@/schemaValidations/account.schema";
import { useState } from "react";
import { columnGuest } from "../column";
import { GuestTableContext } from "../const";
import { TGuest } from "../type";

export default function TableGuest({
  onChoose,
}: {
  onChoose: (guest: TGuest) => void;
}) {
  const [open, setOpen] = useState(false);
  const data: GetListGuestsResType["data"] = [];

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
        <CommonTable<TGuest>
          tableContext={GuestTableContext}
          AddItem={() => null}
          EditItem={() => null}
          onChoose={chooseGuest}
          data={data}
          columns={columnGuest}
          name="Guest"
          pathname="/manage/Guests"
          filterName="name"
        />
      </DialogContent>
    </Dialog>
  );
}
