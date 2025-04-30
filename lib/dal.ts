// https://nextjs.org/docs/app/guides/authentication#creating-a-data-access-layer-dal
import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { getUser } from "@/app/actions/get-user";

export const verifySession = cache(async () => {
  const user = await getUser();
  // if (error) console.error("Error fetching user:", error);

  if (!user) redirect("/login");

  return user;
});
