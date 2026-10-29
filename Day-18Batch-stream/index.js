import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { config } from "dotenv";

config();

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-3.6-flash",
});

const response = await llm.stream("Tell me about generative AI");

for await (const chunk  of response) {
  console.log(chunk.content);
}