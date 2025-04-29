"use server";

import { User } from "@/components/UserContext";
import {
  CognitoIdentityProviderClient,
  GetUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { cookies } from "next/headers";

const client = new CognitoIdentityProviderClient({
  region: "eu-west-3",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("aws-cognito-access-token")?.value;

  if (!accessToken) return null;

  const command = new GetUserCommand({
    AccessToken: accessToken,
  });
  const res = await client.send(command);

  return {
    id: res.UserAttributes?.find((attr) => attr.Name === "sub")?.Value || "",
    email:
      res.UserAttributes?.find((attr) => attr.Name === "email")?.Value || "",
  };
}
