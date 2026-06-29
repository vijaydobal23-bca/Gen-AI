import dotenv from "dotenv";
dotenv.config();

import { encoding_for_model } from "tiktoken";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
  baseURL: "https://models.github.ai/inference",
});

const model = "openai/gpt-4o-mini";
const prompt = "Hello, who are you?";

async function main() {
  const response = await client.chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],

    temperature:1
  });

  console.log(response.choices[0].message.content);

  calculateTokens();
}

function calculateTokens() {
  const encoder = encoding_for_model("gpt-4o-mini");

  const tokens = encoder.encode(prompt);

  console.log("Token IDs:", tokens);
  console.log("Total Tokens:", tokens.length);

  encoder.free();
}

main();