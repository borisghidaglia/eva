import "server-only";

import crypto from "crypto";
import {
  AWS_COGNITO_CLIENT_ID,
  AWS_COGNITO_CLIENT_SECRET,
} from "./taintedEnvVar";

export class MissingClientSecretOrClientIdError extends Error {}

// https://docs.aws.amazon.com/cognito/latest/developerguide/signing-up-users-in-your-app.html#cognito-user-pools-computing-secret-hash
export function getSecretHash(username: string) {
  const clientId = AWS_COGNITO_CLIENT_ID;
  const clientSecret = AWS_COGNITO_CLIENT_SECRET;

  if (!clientSecret || !clientId)
    return new MissingClientSecretOrClientIdError();

  return crypto
    .createHmac("sha256", clientSecret)
    .update(username + clientId)
    .digest("base64");
}
