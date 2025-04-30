"use server";

import { client } from "@/lib/cognito";
import { getChallengeSessionCookie, setAccessTokenCookie } from "@/lib/cookies";
import { getSecretHash } from "@/lib/server-utils";
import {
  AdminRespondToAuthChallengeCommand,
  ChallengeNameType,
} from "@aws-sdk/client-cognito-identity-provider";
import { redirect } from "next/navigation";
import { Result } from "@/lib/utils";
import {
  EmailAndPasswordRequiredError,
  NoAccessTokenError,
} from "@/lib/errors";

export async function newPassword(
  formData: FormData,
): Promise<Result<void, EmailAndPasswordRequiredError>> {
  // log all form data
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  if (!email || !password)
    return { ok: false, error: new EmailAndPasswordRequiredError() };

  const secretHash = getSecretHash(email);
  if (!secretHash.ok) return { ok: false, error: secretHash.error };

  const command = new AdminRespondToAuthChallengeCommand({
    ChallengeName: ChallengeNameType.NEW_PASSWORD_REQUIRED,
    ChallengeResponses: {
      NEW_PASSWORD: password,
      USERNAME: email,
      SECRET_HASH: secretHash.value,
    },
    ClientId: process.env.AWS_COGNITO_CLIENT_ID!,
    UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
    Session: await getChallengeSessionCookie(),
  });

  const res = await client.send(command);
  if (!res.AuthenticationResult || !res.AuthenticationResult.AccessToken)
    return { ok: false, error: new NoAccessTokenError() };

  setAccessTokenCookie(
    res.AuthenticationResult.AccessToken,
    res.AuthenticationResult.ExpiresIn || 3600,
  );

  redirect("/");
}
