"use client";

import { CircleUser, LucideArrowRightFromLine } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUser } from "./UserContext";
import { signOut } from "@/app/actions/sign-out";

export default function Nav() {
  const user = useUser();
  console.log({ user });

  return (
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
  );
}
