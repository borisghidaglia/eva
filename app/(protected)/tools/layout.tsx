import { verifyAdminSession } from "@/lib/dal";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await verifyAdminSession();

  return <>{children}</>;
}
