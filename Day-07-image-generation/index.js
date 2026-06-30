import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateImage() {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: "A cute orange cat wearing sunglasses sitting on a beach at sunset",
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data, "base64");

        fs.writeFileSync("cat.png", buffer);

        console.log("✅ Image saved as cat.png");
      }
    }
  } catch (error) {
    console.error(error);
  }
}

generateImage();