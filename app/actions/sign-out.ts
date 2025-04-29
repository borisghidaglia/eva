"use server";

import { cookies } from "next/headers";

export async function signOut() {
  const cookieStore = await cookies();
  cookieStore.delete("aws-cognito-access-token");
  cookieStore.delete("aws-cognito-challenge-session");
}
