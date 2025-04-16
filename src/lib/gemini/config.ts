export const GEMINI_CONFIG = {
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY || "",
  defaultModel: "gemini-2.0-flash",
  apiVersion: "v1"
} as const;

export const AVAILABLE_MODELS = [
  "gemini-2.0-flash",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
] as const; 