
import { GoogleGenAI, Type } from "@google/genai";
import { CryptoDataPoint, AiInsight, TradingSignal } from '../types';

export const getTradingInsight = async (
  priceData: CryptoDataPoint[],
  apiKey: string
): Promise<AiInsight> => {
  if (!apiKey) {
    throw new Error("API key is not configured.");
  }
  
  const ai = new GoogleGenAI({ apiKey });

  const recentPrices = priceData.slice(-10).map(p => p.price);
  const prompt = `
    Analyze the following recent cryptocurrency price data points (in USD) for a short-term trade: ${recentPrices.join(', ')}.
    Based on this trend, what is the most logical trading action: BUY, SELL, or HOLD?
    Provide a brief reasoning for your decision (max 30 words) and a confidence score between 0 and 100.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            signal: {
              type: Type.STRING,
              description: 'The trading signal, must be one of: BUY, SELL, HOLD.',
              enum: ['BUY', 'SELL', 'HOLD']
            },
            reasoning: {
              type: Type.STRING,
              description: 'A brief explanation for the trading signal.'
            },
            confidence: {
              type: Type.NUMBER,
              description: 'A confidence score from 0 to 100 for this prediction.'
            }
          },
          required: ['signal', 'reasoning', 'confidence']
        },
        temperature: 0.5,
      }
    });

    const text = response.text.trim();
    const parsedJson = JSON.parse(text);

    // Validate the signal
    const signal = (parsedJson.signal || '').toUpperCase();
    if (!Object.values(TradingSignal).includes(signal as TradingSignal)) {
      throw new Error(`Invalid signal received from AI: ${signal}`);
    }

    return {
      signal: signal as TradingSignal,
      reasoning: parsedJson.reasoning || 'No reasoning provided.',
      confidence: Number(parsedJson.confidence) || 50,
    };
  } catch (error) {
    console.error("Error fetching trading insight from Gemini:", error);
    // Provide a fallback error response that matches the expected type
    return {
      signal: TradingSignal.HOLD,
      reasoning: "Could not retrieve AI analysis due to an error. Holding position is the default safe action.",
      confidence: 0,
    };
  }
};