"use server";

import {
  AuthFlowType,
  ChallengeNameType,
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import crypto from "crypto";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const client = new CognitoIdentityProviderClient({
  region: "eu-west-3",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export async function login(formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  if (!email || !password) {
    // TODO: handle error
    throw new Error("Email and password are required");
  }

  const clientId = process.env.AWS_COGNITO_CLIENT_ID!;
  const clientSecret = process.env.AWS_COGNITO_CLIENT_SECRET!;
  const secretHash = getSecretHash(email, clientId, clientSecret);

  const command = new InitiateAuthCommand({
    ClientId: clientId,
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: secretHash,
    },
  });

  const res = await client.send(command);

  if (res.ChallengeName === ChallengeNameType.NEW_PASSWORD_REQUIRED) {
    if (res.Session) {
      const cookieStore = await cookies();
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
      cookieStore.set("aws-cognito-challenge-session", res.Session, {
        httpOnly: true,
        secure: true,
        expires: expiresAt,
        sameSite: "strict",
        path: "/",
      });
    }

    redirect("/new-password");
  }

  if (res.AuthenticationResult && res.AuthenticationResult.AccessToken) {
    const cookieStore = await cookies();
    const expires = new Date(
      Date.now() + (res.AuthenticationResult.ExpiresIn || 3600) * 1000,
    );
    cookieStore.set(
      "aws-cognito-access-token",
      res.AuthenticationResult.AccessToken,
      {
        expires,
        secure: true,
        sameSite: "lax",
      },
    );
    redirect("/");
  }
}

// https://docs.aws.amazon.com/cognito/latest/developerguide/signing-up-users-in-your-app.html#cognito-user-pools-computing-secret-hash
function getSecretHash(
  username: string,
  clientId: string,
  clientSecret: string,
) {
  if (!clientSecret) {
    throw new Error(
      "AWS_COGNITO_CLIENT_SECRET environment variable is not set",
    );
  }
  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}
