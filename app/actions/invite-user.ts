"use server";

import { AdminCreateUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

import { cognitoClient } from "@/lib/cognito";
import { dynamodbClient, invitationTokensTable } from "@/lib/dynamodb";
import {
  EmailRequiredError,
  FailedToCreateUserError,
  FailedToStoreTokenInDbError,
} from "@/lib/errors";
import { getNewInvitationToken } from "@/lib/invitation-token";
import { Result } from "@/lib/utils";

export async function inviteUser(
  formData: FormData,
): Promise<
  Result<
    string,
    EmailRequiredError | FailedToCreateUserError | FailedToStoreTokenInDbError
  >
> {
  const email = formData.get("email")?.toString();
  if (!email) return { ok: false, error: new EmailRequiredError() };

  const createUserCommand = new AdminCreateUserCommand({
    UserPoolId: process.env.AWS_COGNITO_USER_POOL_ID!,
    Username: email,
    UserAttributes: [
      {
        Name: "email",
        Value: email,
      },
      {
        Name: "email_verified",
        Value: "true", // Pre-verify the email
      },
    ],
    MessageAction: "SUPPRESS", // Don't send the default email
  });

  try {
    await cognitoClient.send(createUserCommand);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, error: new FailedToCreateUserError(message) };
  }

  const invitationToken = getNewInvitationToken(email);
  const storeTokenCommand = new PutCommand({
    TableName: invitationTokensTable,
    Item: invitationToken,
  });

  try {
    await dynamodbClient.send(storeTokenCommand);
  } catch {
    return { ok: false, error: new FailedToStoreTokenInDbError() };
  }

  const invitationLink = `/invite/${invitationToken.token}`;
  // TODO: Send the invitation email
  // await sendInvitationEmail(email, invitationLink);
  console.log(`Invitation link: ${invitationLink}`);

  return { ok: true, value: "Email added successfully" };
}
