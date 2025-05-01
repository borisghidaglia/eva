import { CognitoIdentityProviderClient } from "@aws-sdk/client-cognito-identity-provider";

import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from "./taintedEnvVar";

export const cognitoClient = new CognitoIdentityProviderClient({
  region: "eu-west-3",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

// Errors
export class NoUserAttributesError extends Error {}
