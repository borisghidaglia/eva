import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const invitationTokensTable = "InvitationTokens";

const client = new DynamoDBClient({
  region: "eu-west-3",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const dynamodbClient = DynamoDBDocumentClient.from(client);

// Schema
export type InvitationToken = {
  token: string;
  email: string;
  expiresAt: number;
  used: boolean;
};
