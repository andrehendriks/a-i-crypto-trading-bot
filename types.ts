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

export interface Trade {
  id: string;
  type: TradingSignal.BUY | TradingSignal.SELL;
  price: number;
  amountBtc: number;
  time: string;
}

export interface Portfolio {
  eur: number;
  btc: number;
}

export type TradingMode = 'demo' | 'live';
