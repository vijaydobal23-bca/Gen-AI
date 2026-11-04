import { cohoreAi } from './ai.model.js';
import { tool } from "@langchain/core/tools";
import { createAgent } from "langchain";
import { z } from "zod";
import "dotenv/config";

const codeAgent = createAgent({
  model: cohoreAi,
  tools: [],
  systemPrompt:
    "You are an expert software developer and code generation agent. Generate clean, efficient, well-documented, and production-ready code based on requirements.",
});

export const codeTool = tool(
  async ({ query }) => {
    const result = await codeAgent.invoke({
      messages: [{ role: "user", content: query }],
    });
    const last = result.messages.at(-1);
    if (!last?.content) return "";
    return typeof last.content === "string" ? last.content : JSON.stringify(last.content);
  },
  {
    name: "code_agent",
    description:
      "Use when you need to write, generate, modify, or explain code. Input: prompt or requirements for code generation. Returns generated code.",
    schema: z.object({
      query: z.string().describe("Prompt or specifications for code generation"),
    }),
  }
);

export { codeAgent };
