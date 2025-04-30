"use server";

import { User } from "@/components/user-context";
import { client, NoUserAttributesError } from "@/lib/cognito";
import { getAccessTokenCookie } from "@/lib/cookies";
import { Result } from "@/lib/utils";
import { GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";

export async function getUser(): Promise<
  Result<User | null, NoUserAttributesError>
> {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) return { ok: true, value: null };

  const command = new GetUserCommand({ AccessToken: accessToken });
  const res = await client.send(command);
  if (!res.UserAttributes)
    return { ok: false, error: new NoUserAttributesError() };

  return {
    ok: true,
    value: {
      id: res.UserAttributes.find((a) => a.Name === "sub")?.Value || "",
      email: res.UserAttributes.find((a) => a.Name === "email")?.Value || "",
    },
  };
}
