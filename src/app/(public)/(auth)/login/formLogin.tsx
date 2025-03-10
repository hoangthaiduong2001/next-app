"use client";
import { useAppContext } from "@/components/AppProvider";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { handleErrorApi } from "@/config/utils";
import { useLoginMutation } from "@/hooks/useAuth";
import { toast } from "@/hooks/useToast";
import { pathApp } from "@/routes/path";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { initLoginValue } from "./const";

export default function LoginForm() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const { setRole } = useAppContext();
  const clearTokens = searchParams.get("clearTokens");
  const [isHide, setIsHide] = useState<boolean>(true);
  const { mutate: login, status } = useLoginMutation();
  const loginForm = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: initLoginValue,
  });

  const { setError, handleSubmit, control } = loginForm;

  const onSubmit = async (value: LoginBodyType) => {
    if (status === "pending") return;
    login(value, {
      onSuccess: (data) => {
        toast({ description: data.response.message });
        setRole(data.response.data.account.role);
        route.push(pathApp.home);
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
    if (clearTokens) {
      setRole();
    }
  }, [clearTokens, setRole]);

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader className="flex justify-center items-center">
        <CardTitle className="text-4xl font-bold">Login</CardTitle>
        <CardDescription>
          Enter your email and password to login system
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...loginForm}>
          <form
            className="space-y-2 max-w-[600px] flex-shrink-0 w-full"
            noValidate
            onSubmit={handleSubmit(onSubmit, (err) => {
              console.log(err);
            })}
          >
            <div className="grid gap-4">
              <FormField
                control={control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="example@gmail.com"
                        required
                        {...field}
                      />
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid gap-2">
                      <div className="flex items-center">
                        <Label htmlFor="password">Password</Label>
                      </div>
                      <div className="flex justify-between relative items-center">
                        <Input
                          id="password"
                          type={isHide ? "password" : "text"}
                          placeholder="•••••••"
                          required
                          {...field}
                        />
                        <span
                          className="absolute right-3"
                          onClick={() => setIsHide((prev) => !prev)}
                        >
                          {isHide ? (
                            <FaRegEye className="cursor-pointer text-gray-500" />
                          ) : (
                            <FaEyeSlash className="cursor-pointer text-gray-500" />
                          )}
                        </span>
                      </div>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">
                Login
              </Button>
              <Button variant="outline" className="w-full" type="button">
                Login with Google
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
