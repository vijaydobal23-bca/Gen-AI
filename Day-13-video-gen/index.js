import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import express from "express";
import fs from "fs";

dotenv.config();

const app = express();

const googleAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  try {
    const base64Img = fs.readFileSync("image.png", {
      encoding: "base64",
    });

    const response = await googleAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: "image/png",
                data: base64Img,
              },
            },
            {
              text: "Read the image",
            },
          ],
        },
      ],
    });

    console.log(response.text);
  } catch (err) {
    console.error(err);
  }
}



app.listen(3000, () => {
  console.log("Server started on port 3000");
});