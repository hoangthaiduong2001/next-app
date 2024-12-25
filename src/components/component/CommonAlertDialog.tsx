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

type CommonAlertDialogProps<T> = {
  objectDelete: T | null;
  setObjectDelete: (value: T | null) => void;
  handleSubmit: () => void;
  name: string;
  labelCancel?: string;
  labelSubmit?: string;
};

const CommonAlertDialog = <T extends object>({
  objectDelete,
  setObjectDelete,
  handleSubmit,
  name,
  labelCancel = "Cancel",
  labelSubmit = "OK",
}: CommonAlertDialogProps<T>) => {
  return (
    <AlertDialog
      open={Boolean(objectDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setObjectDelete(null);
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
