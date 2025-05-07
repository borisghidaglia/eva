import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider
      className="flex flex-col"
      style={{ "--sidebar-width": "11rem" } as React.CSSProperties}
    >
      <div className="flex flex-1">
        <AppSidebar />
        <SidebarInset className="bg-transparent">{children}</SidebarInset>
      </div>
    </SidebarProvider>
  );
}
