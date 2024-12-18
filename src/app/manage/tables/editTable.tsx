"use client";
import QrCodeTable from "@/components/component/QrCodeTable";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import {
  getTableLink,
  getVietnameseTableStatus,
  handleErrorApi,
} from "@/config/utils";
import { TableStatusValues } from "@/constants/type";
import { useGetTableById, useUpdateTable } from "@/hooks/useTable";
import { toast } from "@/hooks/useToast";
import {
  UpdateTableBody,
  UpdateTableBodyType,
} from "@/schemaValidations/table.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";

export default function EditTable({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const { data } = useGetTableById({ id: Number(id) });
  const { mutate: updateTable, status } = useUpdateTable();
  const form = useForm<UpdateTableBodyType>({
    resolver: zodResolver(UpdateTableBody),
    values: {
      capacity: data?.response.data.capacity || 0,
      status: data?.response.data.status,
      changeToken: false,
    },
  });
  const { control, reset, handleSubmit, setError } = form;
  const onSubmit = async (value: UpdateTableBodyType) => {
    if (status === "pending") return;
    let body: UpdateTableBodyType & { id: number } = {
      ...value,
      id: Number(id),
    };

    updateTable(body, {
      onSuccess: (data) => {
        setId(undefined);
        onSubmitSuccess && onSubmitSuccess();
        toast({
          description: data.response.message,
        });
      },
      onError: (error) => {
        handleErrorApi({
          error,
          setError,
        });
      },
    });
  };

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined);
        }
      }}
    >
      <DialogContent
        className="sm:max-w-[600px] max-h-screen overflow-auto"
        onCloseAutoFocus={() => {
          reset();
          setId(undefined);
        }}
      >
        <DialogHeader>
          <DialogTitle>Update table</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-table-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 py-4">
              <FormItem>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <Label htmlFor="name">Table ID</Label>
                  <div className="col-span-3 w-full space-y-2">
                    <Input
                      id="number"
                      type="number"
                      className="w-full"
                      value={data?.response.data.number || 0}
                      readOnly
                    />
                    <FormMessage />
                  </div>
                </div>
              </FormItem>
              <FormField
                control={control}
                name="capacity"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Capacity (person)</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="capacity"
                          className="w-full"
                          type="number"
                          value={value}
                          onChange={(e) => {
                            if (
                              (Number(e.target.value) > 0 &&
                                typeof Number(e.target.value) === "number") ||
                              e.target.value === ""
                            ) {
                              onChange(e.target.value);
                            }
                          }}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="status"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="description">Status</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select onValueChange={onChange} defaultValue={value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Choose status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {TableStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getVietnameseTableStatus(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="changeToken"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Change QR Code</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <div className="flex items-center space-x-2">
                          <Switch
                            id="changeToken"
                            checked={value}
                            onCheckedChange={onChange}
                          />
                        </div>
                      </div>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormItem>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <Label>QR Code</Label>
                  <div className="col-span-3 w-full space-y-2">
                    {data && (
                      <QrCodeTable
                        token={data.response.data.token}
                        tableNumber={data.response.data.number}
                      />
                    )}
                  </div>
                </div>
              </FormItem>
              <FormItem>
                <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                  <Label>URL order</Label>
                  {data && (
                    <div className="col-span-3 w-full space-y-2">
                      <Link
                        href={getTableLink({
                          token: data.response.data.token,
                          tableNumber: data.response.data.number,
                        })}
                        target="_blank"
                        className="break-all"
                      >
                        {getTableLink({
                          token: data.response.data.token,
                          tableNumber: data.response.data.number,
                        })}
                      </Link>
                    </div>
                  )}
                </div>
              </FormItem>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-table-form">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
