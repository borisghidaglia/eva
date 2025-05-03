"use client";

import {
  LucideBook,
  LucideCloud,
  LucideHelpCircle,
  LucideHome,
  LucideMail,
} from "lucide-react";
import * as React from "react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      className="bg-secondary/20 top-(--header-height) h-[calc(100svh-var(--header-height))]! border-gray-200"
      {...props}
    >
      <SidebarContent>
        <SidebarGroup className="mt-5">
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarMenu>
            <SimpleMenuButton icon={LucideHome}>Home</SimpleMenuButton>
            <SimpleMenuButton icon={LucideCloud}>Data</SimpleMenuButton>
            <SimpleMenuButton icon={LucideBook}>Wiki Scienta</SimpleMenuButton>
          </SidebarMenu>
        </SidebarGroup>
        <SidebarGroup className="mt-auto mb-5">
          <SidebarGroupContent>
            <SidebarMenu>
              <SimpleMenuButton icon={LucideHelpCircle} size="sm">
                Assistance
              </SimpleMenuButton>
              <SimpleMenuButton icon={LucideMail} size="sm">
                Contact
              </SimpleMenuButton>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}

const SimpleMenuButton = ({
  children,
  icon: Icon,
  size = "default",
}: {
  children: React.ReactNode;
  icon: React.ElementType;
  size?: React.ComponentProps<typeof SidebarMenuButton>["size"];
}) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild size={size}>
      <a href="#">
        <Icon />
        <span>{children}</span>
      </a>
    </SidebarMenuButton>
  </SidebarMenuItem>
);
