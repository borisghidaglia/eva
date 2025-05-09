"use client";

import {
  LucideBook,
  LucideChevronsUpDown,
  LucideCloud,
  LucideHome,
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
import { useUser } from "./user-context";
import { UserAvatar, UserMenu } from "./user-menu";

import logo from "@/public/logo.svg";

const dummyConversationHistoryTitle = [
  "Gene association network for CD5 (top 20 co-expressed genes)",
  "Gene co-expression network for CD5, CD6, and CD7",
  "Gene interaction map for TP53 and its top 20 partners",
  "Visualize co-expression for BRCA1, BRCA2, and PALB2",
  "Show gene network for EGFR with most correlated genes",
  "Create a network for MYC and top 20 co-expressed genes",
  "Display co-expression network for KRAS, NRAS, and HRAS",
  "Gene association network for STAT3 (top 20 genes)",
  "Co-expression network for CD19, CD20, and CD22",
  "Gene network for ALB and its 20 strongest partners",
  "Visualize co-expression for APOE, APP, and PSEN1",
  "Gene association map for MDM2 (top 20 genes)",
  "Show co-expression for VEGFA, FLT1, and KDR",
  "Gene network for INS and top 20 co-expressed genes",
  "Display co-expression for FTO, MC4R, and LEPR",
  "Gene association network for ESR1 (top 20 genes)",
  "Co-expression network for IL6, IL10, and TNF",
  "Gene network for CFTR and its 20 top partners",
  "Visualize co-expression for HBB, HBA1, and HBA2",
  "Gene association map for GATA3 (top 20 genes)",
  "Show co-expression for PIK3CA, PTEN, and AKT1",
  "Gene network for SOD1 and top 20 co-expressed genes",
  "Display co-expression for TCF7L2, KCNJ11, and ABCC8",
  "Gene association network for FOXP3 (top 20 genes)",
  "Co-expression network for CD8A, CD8B, and CD3E",
  "Gene network for BCL2 and its 20 strongest partners",
  "Visualize co-expression for MAPT, SNCA, and LRRK2",
  "Gene association map for SMAD4 (top 20 genes)",
  "Show co-expression for JAK2, MPL, and CALR",
  "Gene network for HLA-A and top 20 co-expressed genes",
  "Display co-expression for CYP2D6, CYP3A4, and CYP2C9",
  "Gene association network for RUNX1 (top 20 genes)",
  "Co-expression network for CD4, CD3D, and CD3G",
  "Gene network for G6PD and its 20 top partners",
  "Visualize co-expression for FMR1, MECP2, and UBE3A",
  "Gene association map for TERT (top 20 genes)",
  "Show co-expression for KIT, PDGFRA, and FLT3",
  "Gene network for HNF1A and top 20 co-expressed genes",
  "Display co-expression for APOB, LDLR, and PCSK9",
  "Gene association network for SOX2 (top 20 genes)",
  "Co-expression network for CD14, CD16, and CD68",
  "Gene network for P53 and its 20 strongest partners",
  "Visualize co-expression for GJB2, SLC26A4, and OTOF",
  "Gene association map for RB1 (top 20 genes)",
  "Show co-expression for FGFR1, FGFR2, and FGFR3",
  "Gene network for INS and top 20 co-expressed genes",
  "Display co-expression for HLA-B, HLA-C, and HLA-DRB1",
  "Gene association network for NOD2 (top 20 genes)",
  "Co-expression network for CD44, CD24, and EPCAM",
];

export function AppSidebar({ ...props }: ComponentProps<typeof Sidebar>) {
  const user = useUser();
  return (
    <Sidebar className="bg-secondary/15 border-gray-200" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/" className="contents">
                <Image
                  src={logo}
                  alt="Logo"
                  width={130}
                  height={40}
                  unoptimized
                />
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup className="mt-5">
          <SidebarGroupLabel className="font-bold">Menu</SidebarGroupLabel>
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
        <SidebarGroup className="h-full overflow-hidden">
          <SidebarGroupContent className="h-full">
            <SidebarGroupLabel className="font-bold">History</SidebarGroupLabel>
            <SidebarMenu className="h-full">
              <div className="no-scrollbar flex flex-col gap-1 overflow-y-auto text-gray-500">
                {dummyConversationHistoryTitle.map((title, idx) => (
                  <SimpleMenuButton href="#" size="sm" key={idx}>
                    {title}
                  </SimpleMenuButton>
                ))}
              </div>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu contentProps={{ side: "right", sideOffset: 15 }}>
              <SidebarMenuButton
                size="lg"
                className="hover:bg-primary/10 my-2 h-auto rounded-lg py-1"
              >
                <div className="flex w-full items-center gap-2">
                  <UserAvatar />
                  <div className="flex flex-col gap-0.5 overflow-hidden text-xs">
                    <p className="truncate font-bold wrap-break-word">
                      Julien Duquesne
                    </p>
                    <p className="truncate wrap-break-word text-gray-500">
                      {user?.email ?? ""}
                    </p>
                  </div>
                  <LucideChevronsUpDown className="ml-auto size-4 shrink-0" />
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
  icon?: React.ElementType;
  size?: React.ComponentProps<typeof SidebarMenuButton>["size"];
  href: string;
}) => (
  <SidebarMenuItem>
    <SidebarMenuButton asChild size={size} className="hover:bg-primary/10">
      <Link href={href}>
        {Icon && <Icon />}
        <span>{children}</span>
      </Link>
    </SidebarMenuButton>
  </SidebarMenuItem>
);
