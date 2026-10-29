import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { config } from "dotenv";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import readline from "readline/promises";
import { stdin as input, stdout as output } from "node:process";

config();

const rl = readline.createInterface({ input, output });

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",
});

const history = [];

while (true) {
  const userInput = await rl.question("You: ");

  if (userInput.toLowerCase() === "exit") {
    rl.close();
    break;
  }

  history.push(new HumanMessage(userInput));

  const response = await llm.invoke(history);

  history.push(new AIMessage(response.content));

  console.log("AI:", response.content);
}