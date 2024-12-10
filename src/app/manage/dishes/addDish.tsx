"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useAddDish } from "@/hooks/useDish";
import { useUploadMediaMutation } from "@/hooks/useMedia";
import { toast } from "@/hooks/useToast";
import {
  CreateDishBody,
  CreateDishBodyType,
} from "@/schemaValidations/dish.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { defaultValueFormDish } from "./const";

export default function AddDish() {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const uploadMediaMutation = useUploadMediaMutation();
  const { mutate: createDish, status } = useAddDish();
  const form = useForm<CreateDishBodyType>({
    resolver: zodResolver(CreateDishBody),
    defaultValues: defaultValueFormDish,
  });
  const { control, reset, handleSubmit, watch } = form;
  const { image, name } = watch();
  const previewAvatarFromFile = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return image;
  }, [file, image]);

  const resetForm = () => {
    reset();
    setFile(null);
  };

  const onSubmit = async (value: CreateDishBodyType) => {
    if (status === "pending") return;
    let body = value;
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      const updateImageResult = await uploadMediaMutation.mutateAsync(formData);
      const imageUrl = updateImageResult.response.data;
      body = {
        ...value,
        image: imageUrl,
      };
    }
    createDish(body, {
      onSuccess: (data) => {
        toast({
          description: data.response.message,
        });
        setOpen(false);
        resetForm();
      },
      onError: (error) => {
        handleErrorApi({
          error,
          setError: form.setError,
        });
      },
    });
  };

  return (
    <Dialog
      onOpenChange={(value) => {
        setOpen(value);
        resetForm();
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Add dish
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Add dish</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="add-dish-form"
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
                      <Label htmlFor="description">Dish description </Label>
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
          <Button type="submit" form="add-dish-form">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
