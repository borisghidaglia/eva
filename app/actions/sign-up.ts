"use server";

import { AdminSetUserPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";
import { UpdateCommand } from "@aws-sdk/lib-dynamodb";

import { cognitoClient } from "@/lib/cognito";
import { dynamodbClient, invitationTokensTable } from "@/lib/dynamodb";
import {
  EmailAndPasswordRequiredError,
  FailedToSetInvitationTokenAsUsed,
  FailedToSetUserPassword,
  InputEmailDoesnMatchTokenEmail,
} from "@/lib/errors";
import { getUserEmailFromInvitationToken } from "@/lib/invitation-token";
import { AWS_COGNITO_USER_POOL_ID } from "@/lib/taintedEnvVar";

export async function signUp(token: string, formData: FormData) {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();

  if (!email || !password) return new EmailAndPasswordRequiredError();

  const maybeUserEmail = await getUserEmailFromInvitationToken(token);
  if (maybeUserEmail instanceof Error) return maybeUserEmail;

  const emailFromToken = maybeUserEmail;
  if (email !== emailFromToken) return new InputEmailDoesnMatchTokenEmail();

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
    return new FailedToSetUserPassword(message);
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
    return new FailedToSetInvitationTokenAsUsed(message);
  }
}
