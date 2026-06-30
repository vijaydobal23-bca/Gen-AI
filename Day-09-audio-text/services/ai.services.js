import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function transcribeAudio(buffer) {
  try {
    // Convert to Base64
    const audioBase64 = buffer.toString("base64");

    // Send to Gemini
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: "audio/mpeg",
            data: audioBase64,
          },
        },
        {
          text: "Transcribe this audio exactly as spoken.",
        },
      ],
    });

    console.log("\nTranscription:\n");
    console.log(response.text);
    return response.text;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

;