import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export async function solveMathProblem(base64Image: string, mimeType: string): Promise<string> {
  try {
    const apiKey = process.env.GEMINI_API_KEY || "";
    if (!apiKey) {
      console.error("GEMINI_API_KEY is missing");
      throw new Error("API Key is missing. Please ensure GEMINI_API_KEY is set in the environment.");
    }
    
    const ai = new GoogleGenAI({ apiKey });
    
    // Using gemini-3-flash-preview for fast and capable multimodal reasoning
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image.split(",")[1],
              mimeType: mimeType,
            },
          },
          {
            text: "You are an expert math tutor. Analyze the math problem in this image. Provide a clear, step-by-step solution. Use LaTeX for mathematical formulas where appropriate (e.g., $x^2$). Explain the concepts used. Finally, state the final answer clearly. Use Markdown for formatting.",
          },
        ],
      },
      config: {
        temperature: 0.4, // Lower temperature for more consistent mathematical reasoning
        topP: 0.8,
        topK: 40,
      }
    });

    if (!response.text) {
      throw new Error("The model did not return any text. It might have failed to recognize the problem.");
    }

    return response.text;
  } catch (error: any) {
    console.error("Error in solveMathProblem:", error);
    if (error.message?.includes("API_KEY_INVALID")) {
      throw new Error("Invalid API Key. Please check your configuration.");
    }
    throw new Error(error.message || "Failed to solve the math problem. Please try again with a clearer image.");
  }
}
