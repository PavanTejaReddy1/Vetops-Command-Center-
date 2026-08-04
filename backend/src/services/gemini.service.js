/**
 * Gemini AI integration — PHASE 2.
 *
 * Intentionally unimplemented per the Phase 1 brief ("Do not integrate
 * Gemini AI"). This file exists so the intended integration point is
 * discoverable: prediction generation, AI Review recommendations, and
 * natural-language report summaries will all call through here.
 *
 * Example (for Phase 2 reference):
 *
 * import { GoogleGenerativeAI } from '@google/generative-ai';
 *
 * const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
 *
 * export async function generateBottleneckPrediction(operationalData) {
 *   const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
 *   const result = await model.generateContent(buildPrompt(operationalData));
 *   return result.response.text();
 * }
 */
export async function generateBottleneckPrediction() {
  throw new Error('generateBottleneckPrediction() not implemented — Phase 1 has no AI integration.');
}
