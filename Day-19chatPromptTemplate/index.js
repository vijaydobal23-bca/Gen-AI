
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { config } from "dotenv";
import { ChatPromptTemplate } from "@langchain/core/prompts";

config();

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",
});

const prompts = ChatPromptTemplate.fromMessages([
  ["system", "Explain topics in 100 words."],
  ["human", "Tell me about {topic}"],
]);

const formattedMessage = await prompts.formatMessages({
  topic: "JavaScript",
});

const response = await llm.invoke(formattedMessage);

console.log(response.content);
