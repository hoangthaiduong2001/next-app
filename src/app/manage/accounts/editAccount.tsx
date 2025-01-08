"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { handleErrorApi } from "@/config/utils";
import { useGetAccountById, useUpdateAccount } from "@/hooks/useAccount";
import { useUploadMediaMutation } from "@/hooks/useMedia";
import { toast } from "@/hooks/useToast";
import {
  UpdateEmployeeAccountBody,
  UpdateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { TEditEmployee } from "./type";

export default function EditAccount({
  id,
  setId,
  onSubmitSuccess,
}: TEditEmployee) {
  const [file, setFile] = useState<File | null>(null);
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const { data } = useGetAccountById({
    id: Number(id),
  });
  const { mutate: updateAccount, status } = useUpdateAccount();
  const uploadMediaMutation = useUploadMediaMutation();
  const form = useForm<UpdateEmployeeAccountBodyType>({
    resolver: zodResolver(UpdateEmployeeAccountBody),
    values: {
      name: data?.response.data.name || "",
      email: data?.response.data.email || "",
      avatar: data?.response.data.avatar ?? undefined,
      changePassword: false,
    },
  });
  const { control, handleSubmit, reset, clearErrors, setError } = form;
  const { name, avatar, changePassword, password, confirmPassword } =
    form.getValues();
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return avatar;
  }, [file, avatar]);

  const onSubmit = async (value: UpdateEmployeeAccountBodyType) => {
    if (status === "pending") return;
    let body: UpdateEmployeeAccountBodyType & { id: number } = {
      id: Number(id),
      avatar: value.avatar || undefined,
      ...value,
    };
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const uploadImageResult = await uploadMediaMutation.mutateAsync(formData);
      const imageUrl = uploadImageResult.response.data;
      body = {
        ...body,
        avatar: imageUrl,
      };
    }
    updateAccount(body, {
      onSuccess: (data) => {
        toast({
          description: data.response.message,
        });
        setId(undefined);
        onSubmitSuccess && onSubmitSuccess();
      },
      onError: (error) => {
        handleErrorApi({
          error,
          setError,
        });
      },
    });
  };
  useEffect(() => {
    if (changePassword === false) {
      reset({
        ...form.getValues(),
        password: undefined,
        confirmPassword: undefined,
      });
      clearErrors("confirmPassword");
      clearErrors("password");
    } else if (password?.length && confirmPassword?.length) {
      clearErrors("changePassword");
    }
  }, [changePassword, password, confirmPassword]);

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          setId(undefined);
        }
      }}
    >
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Update account</DialogTitle>
          <DialogDescription>
            Field name, email, password is required
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-employee-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={control}
                name="avatar"
                render={({ field: { onChange } }) => (
                  <FormItem>
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square w-[100px] h-[100px] rounded-md object-cover">
                        <AvatarImage src={previewAvatarFromFile} />
                        <AvatarFallback className="rounded-none">
                          {name || "Avatar"}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        ref={avatarInputRef}
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setFile(file);
                            onChange("http://localhost:3000/" + file.name);
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        className="flex aspect-square w-[100px] items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => avatarInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                  </FormItem>
                )}
              />

              <FormField
                control={control}
                name="name"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Name</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="name"
                          className="w-full"
                          value={value}
                          onChange={onChange}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="email"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="email">Email</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="email"
                          className="w-full"
                          value={value}
                          onChange={onChange}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="changePassword"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="email">Change password</Label>
                      <div className="flex flex-col col-span-3 w-full space-y-2">
                        <Switch
                          checked={value}
                          onCheckedChange={(newValue) => {
                            onChange(newValue);
                          }}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              {changePassword && (
                <FormField
                  control={control}
                  name="password"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="password">New password</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input
                            id="password"
                            className="w-full"
                            type="password"
                            value={value}
                            onChange={onChange}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              )}
              {changePassword && (
                <FormField
                  control={control}
                  name="confirmPassword"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="confirmPassword">
                          Confirm new password
                        </Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input
                            id="confirmPassword"
                            className="w-full"
                            type="password"
                            value={value}
                            onChange={onChange}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              )}
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-employee-form">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
