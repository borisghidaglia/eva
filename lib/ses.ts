import { SESClient } from "@aws-sdk/client-ses";
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from "./taintedEnvVar";

export const sesClient = new SESClient({
  region: "eu-west-3",
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});
