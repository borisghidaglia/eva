import "server-only";

import { GetCommand } from "@aws-sdk/lib-dynamodb";
import { randomBytes } from "crypto";
import {
  dynamodbClient,
  InvitationToken,
  invitationTokensTable,
} from "./dynamodb";
import {
  ErrorFetchingInvitationToken,
  InvalidInvitationTokenError,
  InvitationTokenAlreadyUsedError,
  InvitationTokenExpiredError,
} from "./errors";

export const getNewInvitationToken = (email: string) => {
  const token = randomBytes(32).toString("hex");
  const expirationTime = new Date();
  expirationTime.setHours(expirationTime.getHours() + 24); // 24 hour expiration

  return {
    token: token,
    email: email,
    expiresAt: expirationTime.getTime(),
    used: false,
  };
};

export const getUserEmailFromInvitationToken = async (token: string) => {
  const maybeInvitationToken = await verifyInvitationToken(token);
  if (maybeInvitationToken instanceof Error) {
    const error = maybeInvitationToken;
    return error;
  }

  const invitationToken = maybeInvitationToken;
  return invitationToken.email;
};

async function verifyInvitationToken(token: string) {
  const getCommand = new GetCommand({
    TableName: invitationTokensTable,
    Key: { token },
  });

  let result;
  try {
    result = await dynamodbClient.send(getCommand);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return new ErrorFetchingInvitationToken(message);
  }

  const invitation = result.Item as InvitationToken;

  if (!invitation) return new InvalidInvitationTokenError();

  if (invitation.used) return new InvitationTokenAlreadyUsedError();

  if (invitation.expiresAt < Date.now())
    return new InvitationTokenExpiredError();

  return invitation;
}
