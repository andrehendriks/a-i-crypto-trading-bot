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
    You are a crypto trading analyst bot. Your task is to analyze the following recent price data for BTC/EUR and provide a short-term trading signal.
    Price Data (most recent price is last): ${recentPrices.join(', ')}

    Analyze the data considering the following:
    1.  **Trend & Momentum:** Is there a clear upward, downward, or sideways trend? Is the momentum accelerating or decelerating?
    2.  **Volatility:** Are the price swings large or small?
    3.  **Key Levels:** Does the price appear to be reacting to a support or resistance level within this short timeframe?

    Based on your analysis, decide the most logical trading action: BUY, SELL, or HOLD.
    Provide a concise reasoning for your decision (max 25 words) and a confidence score (0-100) reflecting your certainty.
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
              description: 'A brief explanation for the trading signal based on momentum, volatility, or key levels.'
            },
            confidence: {
              type: Type.NUMBER,
              description: 'A confidence score from 0 to 100 for this prediction.'
            }
          },
          required: ['signal', 'reasoning', 'confidence']
        },
        temperature: 0.6, // Slightly higher for more nuanced analysis
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
