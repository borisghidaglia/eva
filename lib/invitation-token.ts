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
import { Result } from "./utils";

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

export const getUserEmailFromInvitationToken = async (
  token: string,
): Promise<
  Result<
    string,
    | InvalidInvitationTokenError
    | InvitationTokenAlreadyUsedError
    | InvitationTokenExpiredError
  >
> => {
  const invitationToken = await verifyInvitationToken(token);
  if (!invitationToken.ok) {
    return { ok: false, error: invitationToken.error };
  }
  return { ok: true, value: invitationToken.value.email };
};

async function verifyInvitationToken(
  token: string,
): Promise<
  Result<
    InvitationToken,
    | InvalidInvitationTokenError
    | InvitationTokenAlreadyUsedError
    | InvitationTokenExpiredError
  >
> {
  const getCommand = new GetCommand({
    TableName: invitationTokensTable,
    Key: { token },
  });

  let result;
  try {
    result = await dynamodbClient.send(getCommand);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { ok: false, error: new ErrorFetchingInvitationToken(message) };
  }

  const invitation = result.Item as InvitationToken;

  if (!invitation)
    return { ok: false, error: new InvalidInvitationTokenError() };

  if (invitation.used)
    return { ok: false, error: new InvitationTokenAlreadyUsedError() };

  if (invitation.expiresAt < Date.now())
    return { ok: false, error: new InvitationTokenExpiredError() };

  return { ok: true, value: invitation };
}
