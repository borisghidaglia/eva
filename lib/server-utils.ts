import "server-only";

import crypto from "crypto";
import { Result } from "./utils";

export class MissingClientSecretOrClientIdError extends Error {}

// https://docs.aws.amazon.com/cognito/latest/developerguide/signing-up-users-in-your-app.html#cognito-user-pools-computing-secret-hash
export function getSecretHash(
  username: string,
): Result<string, MissingClientSecretOrClientIdError> {
  const clientId = process.env.AWS_COGNITO_CLIENT_ID!;
  const clientSecret = process.env.AWS_COGNITO_CLIENT_SECRET!;

  if (!clientSecret || !clientId)
    return {
      ok: false,
      error: new MissingClientSecretOrClientIdError(),
    };

  return {
    ok: true,
    value: crypto
      .createHmac("sha256", clientSecret)
      .update(username + clientId)
      .digest("base64"),
  };
}
