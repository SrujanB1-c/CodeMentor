import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Initialize Gemini client using GoogleGenAI SDK
const apiKey = process.env.GEMINI_API_KEY;
const ai = apiKey
  ? new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

// Simple schema for explanation
const explanationSchema = {
  type: Type.OBJECT,
  properties: {
    language: {
      type: Type.STRING,
      description: "The detected programming language.",
    },
    purpose: {
      type: Type.STRING,
      description: "A concise 1-sentence summary of the code's purpose.",
    },
    explanation: {
      type: Type.STRING,
      description: "A beautifully structured, beginner-friendly Markdown explanation of the code, detailing how it works, its key concepts, time/space complexity, and a quick tip for improvement.",
    }
  },
  required: ["language", "purpose", "explanation"],
};

const systemInstruction = `You are CodeMentor AI, an expert programming instructor.
Your goal is to provide simple, clear, and beginner-friendly code explanations.
Format the 'explanation' field using beautiful Markdown with headers, bullet points, bold text for key concepts, and inline code blocks where appropriate. Keep it concise, accessible, and clean. Always include:
1. **How it works**: A simple step-by-step walk-through of the execution.
2. **Key Concepts**: Brief explanation of important variables, parameters, or functions.
3. **Complexity**: Simple time and space complexity overview (Big-O).
4. **Quick Tip**: One actionable suggestion to improve the code.`;

// API route to handle simple code analysis
app.post("/api/analyze", async (req, res) => {
  try {
    const { code, language = "auto" } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({ error: "Please enter some code first." });
    }

    if (!ai) {
      return res.status(500).json({
        error: "Gemini API client is not initialized. Please ensure GEMINI_API_KEY is configured in your Secrets.",
      });
    }

    const promptText = `Please analyze this code snippet and provide a simple, helpful explanation:
    
\`\`\`${language}
${code}
\`\`\``;

    const modelsToTry = ["gemini-3.1-flash-lite", "gemini-flash-latest", "gemini-3.5-flash"];
    let lastError: any = null;
    let response: any = null;
    let successfulModel = "";

    for (const modelName of modelsToTry) {
      try {
        console.log(`Attempting analysis with model: ${modelName}`);
        response = await ai.models.generateContent({
          model: modelName,
          contents: promptText,
          config: {
            systemInstruction,
            responseMimeType: "application/json",
            responseSchema: explanationSchema,
            temperature: 0.2,
          },
        });
        if (response && response.text) {
          successfulModel = modelName;
          break;
        }
      } catch (err: any) {
        console.error(`Model ${modelName} failed with error:`, err.message || err);
        lastError = err;
      }
    }

    if (!response || !response.text) {
      throw lastError || new Error("All candidate models failed to return a response.");
    }

    const resultText = response.text;
    const analysisData = JSON.parse(resultText.trim());
    return res.json({
      ...analysisData,
      usedModel: successfulModel
    });
  } catch (error: any) {
    console.error("Error during code analysis:", error);
    return res.status(500).json({
      error: "Failed to analyze code snippet.",
      details: error.message || error,
    });
  }
});

// Configure Vite middleware in development or serve static build files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`CodeMentor AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
