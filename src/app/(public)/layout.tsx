import DarkModeToggle from "@/components/DarkModeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ACCESS_TOKEN } from "@/constants/auth";
import { Menu, Package2 } from "lucide-react";
import { cookies } from "next/headers";
import Link from "next/link";
import DropdownAvatar from "../manage/component/DropdownAvatar";
import NavItems from "./NavItems";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get(ACCESS_TOKEN)?.value;
  const isAuth = Boolean(accessToken);

  return (
    <div className="flex min-h-screen w-full flex-col relative">
      <header className="sticky top-0 flex h-16 items-center gap-4 border-b bg-background px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
          </Link>
          <NavItems
            className="text-muted-foreground transition-colors hover:text-foreground flex-shrink-0"
            isAuth={isAuth}
          />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-1/2">
            <nav className="grid gap-6 text-lg font-medium">
              <Link
                href="#"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <Package2 className="h-6 w-6" />
                <SheetTitle>Foodie HTD</SheetTitle>
              </Link>
              <SheetDescription className="flex flex-col text-lg gap-5">
                <NavItems
                  className="text-muted-foreground transition-colors hover:text-foreground"
                  isAuth={isAuth}
                />
              </SheetDescription>
            </nav>
          </SheetContent>
        </Sheet>
        <div className="ml-auto">
          <DarkModeToggle />
        </div>
        {isAuth && <DropdownAvatar />}
      </header>
      <main className="flex flex-1 justify-center flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
