import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset } from "@/components/ui/sidebar";

export default function ChatLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1">
      <AppSidebar />
      <SidebarInset className="bg-transparent">{children}</SidebarInset>
    </div>
  );
}
