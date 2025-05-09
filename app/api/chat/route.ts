import { openai } from "@ai-sdk/openai";
import {
  experimental_createMCPClient as createMCPClient,
  streamText,
} from "ai";

import { verifySession } from "@/lib/dal";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const mcpClient = await createMCPClient({
  transport: {
    type: "sse",
    url: "https://enigma-mcp-server-452652483423.europe-west4.run.app/sse",
    // optional: configure HTTP headers, e.g. for authentication
    // headers: {
    //   Authorization: "Bearer my-api-key",
    // },
  },
});

export async function POST(req: Request) {
  await verifySession();

  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4o"),
    // https://ai-sdk.dev/docs/ai-sdk-core/tools-and-tool-calling#closing-the-mcp-client
    // Don't know what we should do here as closing the client seems to prevent subsequent interactions
    // onFinish: () => mcpClient.close(),
    // onError: () => mcpClient.close(),
    maxRetries: 1,
    maxSteps: 1,
    messages,
    tools: await mcpClient.tools(),
    system:
      "When you call tools, their result will be automatically displayed to the user. Do not repeat them to the user. Instead, assert that you successfully called the tool and give a bit of context if needed.",
  });

  return result.toDataStreamResponse();
}
