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
 input:[
  {role:"system" , content:"answer in hindi"},
  {role:"developer",content:"give an example in js"},
  {role:"user" ,content:"what is coading"}
  
 ]
});
 
console.log(response.output_text);

app.listen(3000, () => {
  console.log("The server is starting");
});