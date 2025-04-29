import { redirect } from "next/navigation";

import { getUser } from "@/app/actions/getUser";

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUser();
  if (!user) redirect("/login");

  return <>{children}</>;
}
