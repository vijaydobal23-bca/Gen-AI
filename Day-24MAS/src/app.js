import express from "express";
import { config } from "dotenv";
import { runAgent } from "./agent.js";

config();
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "Server is running", message: "Multi-Agent System ready" });
});

app.post("/run", async (req, res) => {
  try {
    const { input, prompt } = req.body;
    const userInput = input || prompt;
    if (!userInput) {
      return res.status(400).json({ error: "Missing 'input' or 'prompt' in request body" });
    }
    const response = await runAgent(userInput);
    res.json({ response });
  } catch (error) {
    console.error("Agent error:", error);
    res.status(500).json({ error: error.message });
  }
});

export default app;
