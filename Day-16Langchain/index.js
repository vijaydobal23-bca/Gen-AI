import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { config } from "dotenv";

config();

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-3.6-flash",
});

const response = await llm.invoke("Tell me about generative AI");

console.log(response.content);