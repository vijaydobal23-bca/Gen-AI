import { ChatMistralAI } from "@langchain/mistralai";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatCohere } from "@langchain/cohere";
import { config } from "dotenv";

config();

// Mistral
export const mistralai = new ChatMistralAI({
  model: process.env.MISTRAL_MODEL || "open-mistral-7b",
  apiKey: process.env.MISTRAL_API_KEY,
});

// Gemini
export const gemini = new ChatGoogleGenerativeAI({
  model: process.env.GEMINI_MODEL || "gemini-3.1-flash-lite",
  apiKey: process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY,
});

// Cohere
export const cohere = new ChatCohere({
  model: process.env.COHERE_MODEL || "command-a-03-2025",
  apiKey: process.env.COHERE_API_KEY,
});

export const cohoreAi = cohere;
