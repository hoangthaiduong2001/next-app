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
import { Textarea } from "@/components/ui/textarea";
import { getVietnameseDishStatus, handleErrorApi } from "@/config/utils";
import { DishStatusValues } from "@/constants/type";
import { toast } from "@/hooks/useToast";
import { useGetDishById, useUpdateDish } from "@/queries/useDish";
import { useUploadMediaMutation } from "@/queries/useMedia";
import {
  UpdateDishBody,
  UpdateDishBodyType,
} from "@/schemaValidations/dish.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { defaultValueFormDish } from "./const";

export default function EditDish({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number | undefined;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const [file, setFile] = useState<File | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const form = useForm<UpdateDishBodyType>({
    resolver: zodResolver(UpdateDishBody),
    defaultValues: defaultValueFormDish,
  });
  const { control, reset, handleSubmit, watch } = form;
  const { data } = useGetDishById({ id: Number(id) });
  const updateDish = useUpdateDish();
  const uploadMediaMutation = useUploadMediaMutation();
  const { image, name } = watch();
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return image;
  }, [file, image]);
  const onSubmit = async (value: UpdateDishBodyType) => {
    if (updateDish.isPending) return;
    try {
      let body: UpdateDishBodyType & { id: number } = {
        ...value,
        id: Number(id),
      };
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const updateImageResult = await uploadMediaMutation.mutateAsync(
          formData
        );
        const imageUrl = await updateImageResult.response.data;
        body = {
          ...body,
          image: imageUrl,
        };
      }
      const result = await updateDish.mutateAsync(body);
      setId(undefined);
      onSubmitSuccess && onSubmitSuccess();
      toast({
        description: result.response.message,
      });
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };
  useEffect(() => {
    if (data) {
      const { image, name, description, price, status } = data.response.data;
      reset({
        name,
        image: image ?? undefined,
        description,
        price,
        status,
      });
    }
  }, [data, reset]);
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
          <DialogTitle>Update dish</DialogTitle>
          <DialogDescription>Field required: name, image</DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="edit-dish-form"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={control}
                name="image"
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
                        ref={imageInputRef}
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
                        onClick={() => imageInputRef.current?.click()}
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
                      <Label htmlFor="name">Name dish</Label>
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
                name="price"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Price</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="price"
                          className="w-full"
                          type="text"
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
                name="description"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="description">Dish description</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Textarea
                          id="description"
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
                name="status"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="description">Status</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select onValueChange={onChange} defaultValue={value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {DishStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getVietnameseDishStatus(status)}
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
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button type="submit" form="edit-dish-form">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
