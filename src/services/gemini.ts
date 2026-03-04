import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export async function solveMathProblem(base64Image: string, mimeType: string): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      throw new Error("API Key is missing. Please configure GEMINI_API_KEY.");
    }
    
    const ai = new GoogleGenAI({ apiKey });
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Image.split(",")[1],
                mimeType: mimeType,
              },
            },
            {
              text: "You are a helpful math teacher. Solve the math problem in this image. Provide a step-by-step explanation and the final answer. Use Markdown for formatting. If there are multiple problems, solve the most prominent one or ask for clarification.",
            },
          ],
        },
      ],
    });

    return response.text || "Sorry, I couldn't solve this problem.";
  } catch (error) {
    console.error("Error solving math problem:", error);
    throw error;
  }
}
