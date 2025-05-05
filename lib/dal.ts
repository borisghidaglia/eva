// https://nextjs.org/docs/app/guides/authentication#creating-a-data-access-layer-dal
import "server-only";

import { redirect } from "next/navigation";
import { cache } from "react";
import { getUser } from "@/app/actions/get-user";

export const verifySession = cache(async () => {
  const user = await getUser();
  // if (error) console.error("Error fetching user:", error);

  if (!user) redirect("/sign-in");

  return user;
});

const adminWhitelist = [
  "borisghidaglia+scientalab@gmail.com",
  "julien.duquesne@scientalab.com",
  "jonathan.plassais@scientalab.com",
];

export const verifyAdminSession = cache(async () => {
  const user = await verifySession();
  if (!user.ok || !user.value) redirect("/");
  if (!adminWhitelist.includes(user.value.email)) redirect("/");
});
