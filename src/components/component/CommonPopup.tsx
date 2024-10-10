import { ReactNode } from "react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

const CommonPopup = ({
  title,
  label,
  content,
  labelSubmit,
  onSubmit,
}: {
  title: string;
  label: string;
  content: ReactNode;
  labelSubmit: string;
  onSubmit: () => void;
}) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="flex w-full justify-start border-none"
        >
          {title}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{label}</DialogTitle>
          <DialogDescription>{content}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button onClick={onSubmit} className="disabled:pointer-events-none">
            {labelSubmit}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CommonPopup;
