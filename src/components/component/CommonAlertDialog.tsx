import { IPlainObject } from "@/types/common";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alertDialog";

type CommonAlertDialogProps<T extends IPlainObject> = {
  itemDelete: T | null;
  setItemDelete: (value: T | null) => void;
  handleSubmit: () => void;
  name: string;
  labelCancel?: string;
  labelSubmit?: string;
};

const CommonAlertDialog = <T extends IPlainObject>({
  itemDelete,
  setItemDelete,
  handleSubmit,
  name,
  labelCancel = "Cancel",
  labelSubmit = "OK",
}: CommonAlertDialogProps<T>) => {
  return (
    <AlertDialog
      open={Boolean(itemDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setItemDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete {name}?</AlertDialogTitle>
          <AlertDialogDescription>
            {`${name} `}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {`This ${name}`}
            </span>{" "}
            will be permanently deleted
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{labelCancel}</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit}>
            {labelSubmit}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CommonAlertDialog;
