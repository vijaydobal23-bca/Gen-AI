import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import express from "express";

dotenv.config();

const app = express();

const googleAI = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", async (req, res) => {
    try {
        res.setHeader("Content-Type", "text/plain");
        res.setHeader("Transfer-Encoding", "chunked");

        const response = await googleAI.models.generateContentStream({
            model: "gemini-2.5-flash",
            contents: "Tell me about AI",
        });

        for await (const chunk of response) {
            if (chunk.text) {
                res.write(chunk.text);
            }
        }

        res.end();
    } catch (err) {
        console.error(err);
        res.status(500).send("Something went wrong");
    }
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});