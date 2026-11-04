import { createAgent } from "langchain";
import { gemini } from "./ai.model.js";
import { researchTool } from "./reasearch.agent.js";
import { codeTool } from "./code.agent.js";
import { reviewTool } from "./review.agent.js";

const systemPrompt = `You are the primary orchestrator agent. You receive complex
tasks from the user and coordinate specialist sub-agents to complete them.

You have three tools:
- research_agent: use when you need facts, information, or data
- code_agent: use when you need to write or generate code
- review_agent: use when you need to verify, check, or validate content

Your job is to:
1. Break the task into subtasks
2. Delegate each subtask to the right specialist agent
3. Use the review_agent to verify important outputs
4. Assemble and return a complete, high-quality final answer

Always review code before returning it. Always verify facts when accuracy matters.`;

const primaryAgent = createAgent({
  model: gemini,
  tools: [researchTool, codeTool, reviewTool],
  systemPrompt,
});

export async function runAgent(input) {
  const result = await primaryAgent.invoke({
    messages: [{ role: "user", content: input }],
  });
  const last = result.messages.at(-1);
  return typeof last?.content === "string" ? last.content : JSON.stringify(last?.content ?? "");
}

export { primaryAgent };
export default primaryAgent;
