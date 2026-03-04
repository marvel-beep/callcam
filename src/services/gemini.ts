import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function solveMathProblem(base64Image: string, mimeType: string): Promise<string> {
  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            {
              inlineData: {
                data: base64Image.split(",")[1], // Remove the data:image/png;base64, prefix
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
    throw new Error("Failed to process image. Please try again.");
  }
}
