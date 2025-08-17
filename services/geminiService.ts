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

  const recentPrices = priceData.slice(-20).map(p => p.price);
  const prompt = `
    You are an expert crypto trading bot specializing in a trend-following strategy. Your goal is to identify the dominant short-term trend from recent BTC/EUR price data and generate a trading signal that aligns with that trend.

    Price Data (most recent price is last): ${recentPrices.join(', ')}

    Follow these steps for your analysis:
    1.  **Identify the Primary Trend:** First, determine if the market is in an UPTREND, DOWNTREND, or is CONSOLIDATING (sideways).
    2.  **Generate a Signal:**
        - If in a clear UPTREND, your primary signals should be BUY or HOLD. Only signal SELL if you see a very strong reversal pattern.
        - If in a clear DOWNTREND, your primary signals should be SELL or HOLD. Only signal BUY if you see a very strong bottoming pattern.
        - If CONSOLIDATING, prefer HOLD, but you can issue a BUY or SELL signal if the price breaks out of the consolidation range.
    3.  **Provide Reasoning:** Briefly explain the trend you've identified and why it justifies your signal (max 25 words).
    4.  **Confidence Score:** Provide a confidence score (0-100) reflecting the clarity and strength of the identified trend.
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
              description: 'A brief explanation for the trading signal based on the identified trend.'
            },
            confidence: {
              type: Type.NUMBER,
              description: 'A confidence score from 0 to 100 for this prediction, based on trend strength.'
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