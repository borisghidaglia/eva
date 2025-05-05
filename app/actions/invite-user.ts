"use server";

import { AdminCreateUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { SendEmailCommand } from "@aws-sdk/client-ses";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

import { cognitoClient } from "@/lib/cognito";
import { dynamodbClient, invitationTokensTable } from "@/lib/dynamodb";
import {
  EmailRequiredError,
  FailedToCreateUserError,
  FailedToSendInviteEmail,
  FailedToStoreTokenInDbError,
} from "@/lib/errors";
import { getNewInvitationToken } from "@/lib/invitation-token";
import { sesClient } from "@/lib/ses";
import { AWS_COGNITO_USER_POOL_ID } from "@/lib/taintedEnvVar";
import { Result } from "@/lib/utils";

export async function inviteUser(
  formData: FormData,
): Promise<
  Result<
    string,
    | EmailRequiredError
    | FailedToCreateUserError
    | FailedToStoreTokenInDbError
    | FailedToSendInviteEmail
  >
> {
  const email = formData.get("email")?.toString();
  if (!email) return { ok: false, error: new EmailRequiredError() };

  const createUserCommand = new AdminCreateUserCommand({
    UserPoolId: AWS_COGNITO_USER_POOL_ID,
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

  const invitationLink = new URL(
    `/sign-up/${invitationToken.token}`,
    process.env.NEXT_PUBLIC_ROOT_URL,
  ).toString();

  const sendEmailCommand = new SendEmailCommand({
    Source: "no-reply@scientalab.com",
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: "You've been invited to join Eva" },
      Body: {
        Html: {
          Data: `Click the link below to accept the invitation:<br><br><a href="${invitationLink}">${invitationLink}</a>`,
        },
      },
    },
  });

  try {
    await sesClient.send(sendEmailCommand);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, error: new FailedToSendInviteEmail(message) };
  }

  return { ok: true, value: "Email added successfully" };
}
