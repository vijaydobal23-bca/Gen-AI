import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const model = "openai/gpt-4o-mini";

const openAiModel = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
  baseURL: "https://models.github.ai/inference",
});

async function aiAnswer(prompt) {
  try {
    const response = await openAiModel.chat.completions.create({
      model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
    });

    console.log("\nAI:", response.choices[0].message.content);
    process.stdout.write("\nEnter prompt: ");
  } catch (err) {
    console.error(err);
  }
}

process.stdout.write("Enter prompt: ");

process.stdin.on("data", (data) => {
  const prompt = data.toString().trim();

  if (prompt.toLowerCase() === "exit") {
    process.exit(0);
  }

  aiAnswer(prompt);
});