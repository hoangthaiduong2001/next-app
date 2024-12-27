"use client";
import { useAppContext } from "@/components/AppProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleErrorApi } from "@/config/utils";
import { useGuestLoginMutation } from "@/hooks/useGuest";
import {
  GuestLoginBody,
  GuestLoginBodyType,
} from "@/schemaValidations/guest.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export default function GuestLoginForm() {
  const { setRole } = useAppContext();
  const route = useRouter();
  const searchParam = useSearchParams();
  const param = useParams();
  const { mutate: guestLogin, status } = useGuestLoginMutation();
  const tableNumber = Number(param.number);
  const token = searchParam.get("token") ?? "";
  const form = useForm<GuestLoginBodyType>({
    resolver: zodResolver(GuestLoginBody),
    defaultValues: {
      name: "",
      token,
      tableNumber,
    },
  });
  const { control, handleSubmit, setError } = form;
  const onSubmit = (value: GuestLoginBodyType) => {
    if (status === "pending") return;
    guestLogin(value, {
      onSuccess: (data) => {
        setRole(data.response.data.guest.role);
        route.push("/guest/menu");
        route.refresh();
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
    if (!token) {
      route.push("/");
    }
  }, [token]);
  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Login to order</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="grid gap-4">
              <FormField
                control={control}
                name="name"
                render={({ field: { value, onChange } }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="name">Name guest</Label>
                      <Input
                        id="name"
                        type="text"
                        required
                        value={value}
                        onChange={onChange}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
