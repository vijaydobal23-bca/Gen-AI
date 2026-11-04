import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
  baseURL: "https://models.github.ai/inference",
});

async function main() {
  const response = await client.chat.completions.create({
    model: "openai/gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: "Hello, who are you?",
      },
    ],
  });

  console.log(response.choices[0].message.content);
}

main();