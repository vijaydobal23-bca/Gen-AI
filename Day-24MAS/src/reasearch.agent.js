import { createAgent } from "langchain";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import "dotenv/config";
import { mistralai } from "./ai.model.js";

const reasearchAgent = createAgent({
  model: mistralai,
  tools: [],
  systemPrompt:
    "You are a specialist research agent. Your job is to research topics thoroughly, find accurate facts, synthesize information, and provide clear, well-structured summaries.",
});

export const researchTool = tool(
  async ({ query }) => {
    const result = await reasearchAgent.invoke({
      messages: [{ role: "user", content: query }],
    });
    const last = result.messages.at(-1);
    if (!last?.content) return "";
    return typeof last.content === "string" ? last.content : JSON.stringify(last.content);
  },
  {
    name: "research_agent",
    description:
      "Use when you need facts, information, data, or documentation. Input: query or topic to research. Returns detailed research findings.",
    schema: z.object({
      query: z.string().describe("Topic or question to research"),
    }),
  }
);

export { reasearchAgent };
