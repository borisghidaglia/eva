"use server";

import { cognitoClient } from "@/lib/cognito";
import {
  EmailAndPasswordRequiredError,
  LoginDidntRedirectError,
} from "@/lib/errors";
import { getSecretHash } from "@/lib/server-utils";
import { Result } from "@/lib/utils";
import {
  AuthFlowType,
  ChallengeNameType,
  InitiateAuthCommand,
} from "@aws-sdk/client-cognito-identity-provider";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(
  formData: FormData,
): Promise<Result<void, EmailAndPasswordRequiredError>> {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  if (!email || !password)
    return { ok: false, error: new EmailAndPasswordRequiredError() };

  const secretHash = getSecretHash(email);
  if (!secretHash.ok) return { ok: false, error: secretHash.error };

  const command = new InitiateAuthCommand({
    ClientId: process.env.AWS_COGNITO_CLIENT_ID!,
    AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
    AuthParameters: {
      USERNAME: email,
      PASSWORD: password,
      SECRET_HASH: secretHash.value,
    },
  });

  const res = await cognitoClient.send(command);

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

  return { ok: false, error: new LoginDidntRedirectError() };
}
