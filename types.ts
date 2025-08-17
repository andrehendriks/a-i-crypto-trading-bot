
export interface CryptoDataPoint {
  time: string;
  price: number;
}

export enum TradingSignal {
  BUY = 'BUY',
  SELL = 'SELL',
  HOLD = 'HOLD',
}

export interface AiInsight {
  signal: TradingSignal;
  reasoning: string;
  confidence: number;
}