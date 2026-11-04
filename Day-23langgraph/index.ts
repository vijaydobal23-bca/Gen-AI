
import { HumanMessage } from "@langchain/core/messages";
import {
  StateGraph,
  StateSchema,
  MessagesValue,
  ReducedValue,
  GraphNode,
  START,
  END,
} from "@langchain/langgraph";

import { z } from "zod";
import express from "express";
import { createAgent, providerStrategy } from "langchain";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Define your models separately:
// mistralModel
// cohereModel
// geminiModel

// 1. Define State

const State = new StateSchema({
  messages: MessagesValue,

  solution_1: new ReducedValue(z.string().default(""), {
    reducer: (current, next) => next,
  }),

  solution_2: new ReducedValue(z.string().default(""), {
    reducer: (current, next) => next,
  }),

  judge_recommendation: new ReducedValue(
    z.object({
      solution_1_score: z.number(),
      solution_2_score: z.number(),
      winner: z.enum(["solution_1", "solution_2"]),
    }).default({
      solution_1_score: 0,
      solution_2_score: 0,
      winner: "solution_1",
    }),
    {
      reducer: (current, next) => next,
    }
  ),
});

// 2. Solution Node

const solutionNode: GraphNode<typeof State> = async (state) => {
  const problem = String(state.messages[0]?.content ?? "");

  const [result1, result2] = await Promise.all([
    mistralModel.invoke(problem),
    cohereModel.invoke(problem),
  ]);

  return {
    solution_1: String(result1.content),
    solution_2: String(result2.content),
  };
};

// 3. Judge Node

const judgeNode: GraphNode<typeof State> = async (state) => {

  const judge = createAgent({
    model: geminiModel,
    tools: [],

    responseFormat: providerStrategy(
      z.object({
        solution_1_score: z.number().min(0).max(10),
        solution_2_score: z.number().min(0).max(10),
        winner: z.enum(["solution_1", "solution_2"]),
      })
    ),
  });

  const judgeResponse = await judge.invoke({
    messages: [
      new HumanMessage(`
        You are an expert judge.

        Evaluate both solutions based on:
        1. Accuracy
        2. Clarity
        3. Efficiency

        Problem:
        ${String(state.messages[0]?.content ?? "")}

        Solution 1:
        ${state.solution_1}

        Solution 2:
        ${state.solution_2}

        Give each solution a score between 0 and 10.
        Select the better solution as the winner.
      `),
    ],
  });

  return {
    judge_recommendation: judgeResponse.structuredResponse,
  };
};

// 4. Build Graph

const graph = new StateGraph(State)
  .addNode("solution", solutionNode)
  .addNode("judge", judgeNode)

  .addEdge(START, "solution")
  .addEdge("solution", "judge")
  .addEdge("judge", END)

  .compile();

// 5. Graph Function

export default async function useGraph(userMessage: string) {

  const result = await graph.invoke({
    messages: [new HumanMessage(userMessage)],
  });

  return result;
}

// 6. Health API

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "OK",
  });
});

// 7. Graph API

app.post("/use-graph", async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required",
      });
    }

    const result = await useGraph(message);

    res.status(200).json(result);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Graph execution failed",
    });
  }
});

// 8. Start Server

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
