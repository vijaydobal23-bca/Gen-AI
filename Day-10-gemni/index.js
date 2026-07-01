import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function chat() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "tell me about Narendra modi sir",
      config:{
        systemInstruction:"give simple answers in 20 words",
        thinkingConfig:{
          includeThoughts:true,
          thinkingBudget:100
        },
        temperature:1
      }
    });

    console.log(response.candidates[0].content);

   
  } catch (error) { 
    console.error(error);
  }
}

chat();