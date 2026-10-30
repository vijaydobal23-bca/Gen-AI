
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { config } from "dotenv";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";

config();

const llm = new ChatGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
  model: "gemini-2.5-flash",
});

const prompt = ChatPromptTemplate.fromMessages([
  ["system", "Explain the given topic in {words} words."],
  ["human", "Explain {topic}"],
]);

const chain = prompt.pipe(llm).pipe(new StringOutputParser());

const response = await chain.invoke({
  topic: "Maths",
  words: 20,
});

console.log(response);
