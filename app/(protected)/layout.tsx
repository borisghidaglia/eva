import { redirect } from "next/navigation";

import { verifySession } from "@/lib/dal";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await verifySession();
  if (!user.ok) console.error(user.error);
  if (!user.ok || !user.value) redirect("/sign-in");

  return <>{children}</>;
}
