import express from "express";
const app = express();

import dotenv from "dotenv";
dotenv.config();

import OpenAI from "openai";

app.get("/", (req, res) => {
  res.status(200).json({
    message: "The server is starting",
    success: true,
  });
});

const openAiModel = new OpenAI({
  apiKey: process.env.OPEN_AI_KEY,
});
 
const response = await openAiModel.responses.create({
  input: "what is the color of an apple",
  model: "gpt-4o-mini",
});
 
console.log(response.output_text);

app.listen(3000, () => {
  console.log("The server is starting");
});