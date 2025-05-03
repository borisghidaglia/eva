"use client";

import logo from "@/public/logo.svg";
import { CircleUser, LucideArrowRightFromLine } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { signOut } from "@/app/actions/sign-out";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "@/components/user-context";

export function AppHeader() {
  const user = useUser();

  return (
    <header className="sticky top-0 z-50 flex h-(--header-height) items-center justify-between overscroll-contain border-b border-gray-200 bg-white px-10">
      <Link href="/" className="contents">
        <Image src={logo} alt="Logo" width={120} height={40} unoptimized />
      </Link>
      <div className="flex items-center gap-4">
        <p className="text-sm text-gray-400">
          Hello, {user?.email ?? "Dear User"}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger className="bg-primary grid h-10 w-10 place-items-center rounded-full">
            <CircleUser className="h-6 w-6 text-white" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Admin</DropdownMenuItem>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>WikiScienta</DropdownMenuItem>
            <DropdownMenuItem>
              <Button className="w-full text-xs" onClick={signOut}>
                <LucideArrowRightFromLine className="h-2 w-2 text-white" />
                Sign out
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
