"use client";
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
import { toast } from "@/hooks/use-toast";
import { useLoginMutation } from "@/queries/useAuth";
import { pathApp } from "@/routes/path";
import { LoginBody, LoginBodyType } from "@/schemaValidations/auth.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { initLoginValue } from "./const";

export default function LoginForm() {
  const route = useRouter();
  const loginMutation = useLoginMutation();
  const loginForm = useForm<LoginBodyType>({
    resolver: zodResolver(LoginBody),
    defaultValues: initLoginValue,
  });

  const { setError, handleSubmit, control } = loginForm;

  const onSubmit = async (data: LoginBodyType) => {
    if (loginMutation.isPending) return;
    try {
      const result = await loginMutation.mutateAsync(data);
      toast({ description: result.response.message });
      route.push(pathApp.home);
      route.refresh();
    } catch (error) {
      handleErrorApi({
        error,
        setError,
      });
    }
  };

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
                      <Input
                        id="password"
                        type="password"
                        required
                        {...field}
                      />
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
