"use client";
import { useAppContext } from "@/components/AppProvider";
import CommonPopup from "@/components/component/CommonPopup";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/hooks/useToast";
import { useLogoutMutation } from "@/queries/useAuth";
import { useGetProfileMe } from "@/queries/useMe";
import { pathApp } from "@/routes/path";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DropdownAvatar() {
  const logoutMutation = useLogoutMutation();
  const route = useRouter();
  const { data } = useGetProfileMe();
  const { setIsAuth } = useAppContext();
  const account = data?.response.data;
  const handleLogout = async () => {
    if (logoutMutation.isPending) return;
    try {
      const result = await logoutMutation.mutateAsync();
      setIsAuth(false);
      route.push("/");
      route.refresh();
      toast({ description: result.response.message });
    } catch {
      toast({ description: "Can not logout" });
    }
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="overflow-hidden rounded-full"
        >
          <Avatar>
            <AvatarImage
              src={account?.avatar ?? undefined}
              alt={account?.name}
            />
            <AvatarFallback>
              {account?.name.slice(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{account?.name}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={pathApp.manage.setting} className="cursor-pointer">
            Setting
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem>
        <DropdownMenuSeparator />
        <CommonPopup
          title="Logout"
          label="Confirm logout"
          content="Are you want logout?"
          labelSubmit="Logout"
          type="logout"
          onSubmit={handleLogout}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
