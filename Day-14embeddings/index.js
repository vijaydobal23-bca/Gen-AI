import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";

dotenv.config();

const googleAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateEmbeddings() {
  try {
    const response = await googleAI.models.embedContent({
      model: "gemini-embedding-001",
      contents: ["What is Kubernetes?"],
    });

    console.log(response.embeddings[0].values);
    fs.writeFileSync(
      "embed.json",
      JSON.stringify(response.embeddings[0].values, null, 2),
    );
  } catch (err) {
    console.error(err);
  }
}

generateEmbeddings();
