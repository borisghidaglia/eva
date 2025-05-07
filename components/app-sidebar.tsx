"use client";

import {
  LucideBook,
  LucideCloud,
  LucideHelpCircle,
  LucideHome,
  LucideMail,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ComponentProps } from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { UserAvatar, UserMenu } from "./user-menu";
import { useUser } from "./user-context";

import logo from "@/public/logo.svg";

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const user = useUser();
  return (
    <Sidebar className="bg-secondary/20 border-gray-200" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="contents">
                <Image
                  src={logo}
                  alt="Logo"
                  width={120}
                  height={40}
                  unoptimized
                  className="brightness-0"
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="mt-5">
          <SidebarMenu>
            <SimpleMenuButton href="/" icon={LucideHome}>
              Home
            </SimpleMenuButton>
            <SimpleMenuButton href="#" icon={LucideCloud}>
              Data
            </SimpleMenuButton>
            <SimpleMenuButton href="#" icon={LucideBook}>
              Wiki Scienta
            </SimpleMenuButton>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="mt-auto mb-5">
          <SidebarGroupContent>
            <SidebarMenu>
              <SimpleMenuButton href="#" icon={LucideHelpCircle} size="sm">
                Assistance
              </SimpleMenuButton>
              <SimpleMenuButton href="#" icon={LucideMail} size="sm">
                Contact
              </SimpleMenuButton>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu contentProps={{ side: "right", sideOffset: 15 }}>
              <SidebarMenuButton size="lg">
                <div className="flex items-center gap-2 overflow-hidden">
                  <UserAvatar />
                  <p className="truncate wrap-break-word text-gray-400">
                    {user?.email ?? "Dear User"}
                  </p>
                </div>
              </SidebarMenuButton>
            </UserMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

const SimpleMenuButton = ({
  children,
  icon: Icon,
  size = "default",
  href,
}: {
  children: React.ReactNode;
  icon: React.ElementType;
  size?: React.ComponentProps<typeof SidebarMenuButton>["size"];
  href: string;
}) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild size={size} className="hover:bg-primary/10">
      <Link href={href}>
        <Icon />
        <span>{children}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);
