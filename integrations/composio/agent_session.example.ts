/**
 * PulseGrid × Composio — example agent session (TypeScript)
 * Requires: npm i @composio/core @composio/openai openai
 * Set COMPOSIO_API_KEY and OPENAI_API_KEY
 */
import { Composio } from "@composio/core";
import { OpenAIProvider } from "@composio/openai";
import OpenAI from "openai";

const composio = new Composio({
  apiKey: process.env.COMPOSIO_API_KEY!,
  provider: new OpenAIProvider(),
});

const openai = new OpenAI();

/** Load GitHub + Notion tools (connect accounts in Composio dashboard first) */
export async function getMusicStackTools(userId = "default") {
  return composio.tools.get(userId, {
    toolkits: ["github", "notion", "gmail", "googledrive"],
    limit: 40,
  });
}

/**
 * Agent: take PulseGrid pattern JSON + push gist + draft Notion page
 */
export async function publishPulseGridPattern(
  userId: string,
  patternJson: object,
  title = "PulseGrid pattern"
) {
  const tools = await getMusicStackTools(userId);
  const body = JSON.stringify(patternJson, null, 2);

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    tools,
    messages: [
      {
        role: "system",
        content:
          "You are a music production assistant. Publish PulseGrid exports to GitHub Gist and Notion when asked.",
      },
      {
        role: "user",
        content: `Create a private gist named pulsegrid-pattern.json with this content, then a Notion page titled "${title}" summarizing BPM and track hit counts:\n\n${body}`,
      },
    ],
  });

  return response;
}

/** Tool Router / MCP style — BeatAPI if you need AI media pipelines */
export async function createBeatApiMcp() {
  // See https://composio.dev/toolkits/beatapi
  // composio.mcp.create({ toolkits: ["beatapi"], ... })
  return { note: "Configure BeatAPI auth_config in Composio dashboard" };
}
