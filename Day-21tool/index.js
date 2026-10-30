
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { config } from "dotenv";
import { sentEmail } from "./email.service.js";
import { tool, createAgent } from "langchain";
import * as z from "zod";

config();

// Email tool
const emailTool = tool(
  async ({ to, subject, html, text }) => {
    console.log("Sending email to:", to);

    const result = await sentEmail(to, subject, html, text);

    return JSON.stringify(result);
  },
  {
    name: "emailtool",
    description: "Send an email using Gmail.",
    schema: z.object({
      to: z.string().email().describe("Recipient email address"),
      subject: z.string().describe("Email subject"),
      html: z.string().describe("HTML email content"),
      text: z.string().describe("Plain text email content"),
    }),
  }
);

// Gemini model
const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",
});

// Agent
const agent = createAgent({
  model: llm,
  tools: [emailTool],
  systemPrompt: `
    You are an intelligent email assistant.

    When the user requests an email:

    1. Understand the user's intention.
    2. Generate an appropriate subject.
    3. Write professional HTML email content.
    4. Generate plain text content.
    5. Extract the recipient email address.
    6. Call emailtool with all four required arguments.
    7. Confirm email delivery only after successful tool execution.

    Never invent a recipient email address.
  `,
});


const response = await agent.invoke({
  messages: [
    {
      role: "user",
      content: "Send a well-wishing email to vijaydobal27@gmail.com",
    },
  ],
});

// Output
console.log("\nAgent Response:");

console.log(
  response.messages.at(-1).content
);
