"use server";

import { cognitoClient } from "@/lib/cognito";
import { dynamodbClient, invitationTokensTable } from "@/lib/dynamodb";
import {
  EmailAndPasswordRequiredError,
  FailedToSetInvitationTokenAsUsed,
  FailedToSetUserPassword,
  InputEmailDoesnMatchTokenEmail,
  InvalidInvitationTokenError,
  InvitationTokenAlreadyUsedError,
  InvitationTokenExpiredError,
  NoAccessTokenError,
} from "@/lib/errors";
import { getUserEmailFromInvitationToken } from "@/lib/invitation-token";
import { getSecretHash } from "@/lib/server-utils";
import { AWS_COGNITO_USER_POOL_ID } from "@/lib/taintedEnvVar";
import { Result } from "@/lib/utils";
import { AdminSetUserPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

export async function signUp(
  token: string,
  formData: FormData,
): Promise<
  Result<
    void,
    | EmailAndPasswordRequiredError
    | InputEmailDoesnMatchTokenEmail
    | InvalidInvitationTokenError
    | InvitationTokenAlreadyUsedError
    | InvitationTokenExpiredError
    | NoAccessTokenError
    | FailedToSetUserPassword
    | FailedToSetInvitationTokenAsUsed
  >
> {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password)
    return { ok: false, error: new EmailAndPasswordRequiredError() };

  const emailFromToken = await getUserEmailFromInvitationToken(token);
  if (!emailFromToken.ok) return { ok: false, error: emailFromToken.error };

  if (email !== emailFromToken.value)
    return { ok: false, error: new InputEmailDoesnMatchTokenEmail() };

  const secretHash = getSecretHash(email);
  if (!secretHash.ok) return { ok: false, error: secretHash.error };

  const command = new AdminSetUserPasswordCommand({
    Password: password,
    Permanent: true,
    Username: email,
    UserPoolId: AWS_COGNITO_USER_POOL_ID,
  });

  try {
    await cognitoClient.send(command);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, error: new FailedToSetUserPassword(message) };
  }

  // Mark invitation token as used
  const updateTokenCommand = new UpdateCommand({
    TableName: invitationTokensTable,
    Key: { token },
    UpdateExpression: "set used = :used",
    ExpressionAttributeValues: {
      ":used": true,
    },
  });

  try {
    await dynamodbClient.send(updateTokenCommand);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, error: new FailedToSetInvitationTokenAsUsed(message) };
  }

  return { ok: true, value: undefined };
}
