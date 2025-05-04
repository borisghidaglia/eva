"use server";

import { User } from "@/components/user-context";
import { cognitoClient, NoUserAttributesError } from "@/lib/cognito";
import { getAccessTokenCookie } from "@/lib/cookies";
import { FailedToGetUserError } from "@/lib/errors";
import { GetUserCommand } from "@aws-sdk/client-cognito-identity-provider";

export async function getUser() {
  const accessToken = await getAccessTokenCookie();
  if (!accessToken) return null;

  const command = new GetUserCommand({ AccessToken: accessToken });

  let res;
  try {
    res = await cognitoClient.send(command);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new FailedToGetUserError(message);
  }

  if (!res.UserAttributes) return new NoUserAttributesError();

  return {
    id: res.UserAttributes.find((a) => a.Name === "sub")?.Value || "",
    email: res.UserAttributes.find((a) => a.Name === "email")?.Value || "",
  } as User;
}
