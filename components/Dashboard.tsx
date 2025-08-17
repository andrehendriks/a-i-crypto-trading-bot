import React, { useState, useEffect, useCallback } from 'react';
import PriceChart from './PriceChart';
import AiInsight from './AiInsight';
import BotStatus from './BotStatus';
import Portfolio from './Portfolio';
import TradeHistory from './TradeHistory';
import useCryptoData from '../hooks/useCryptoData';
import { Portfolio as PortfolioType, Trade, AiInsight as AiInsightType, TradingSignal } from '../types';
import { getTradingInsight } from '../services/geminiService';

interface DashboardProps {
    apiKey: string;
}

const ANALYSIS_INTERVAL = 15000; // 15 seconds

const Dashboard: React.FC<DashboardProps> = ({ apiKey }) => {
  const { data } = useCryptoData(45000, 100, 2000); // Start price, volatility, interval
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [portfolio, setPortfolio] = useState<PortfolioType>({ usd: 10000, btc: 0.5 });
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [lastAutoInsight, setLastAutoInsight] = useState<AiInsightType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  const executeTrade = useCallback((signal: TradingSignal.BUY | TradingSignal.SELL, price: number) => {
    const tradeAmountUsd = 500; // Trade a fixed $500 value
    
    setPortfolio(prev => {
        let newPortfolio = {...prev};
        if (signal === TradingSignal.BUY && prev.usd >= tradeAmountUsd) {
            const btcAmount = tradeAmountUsd / price;
            newPortfolio = { usd: prev.usd - tradeAmountUsd, btc: prev.btc + btcAmount };
        } else if (signal === TradingSignal.SELL) {
            const btcToSell = tradeAmountUsd / price;
            if (prev.btc >= btcToSell) {
                newPortfolio = { usd: prev.usd + tradeAmountUsd, btc: prev.btc - btcToSell };
            }
        } else {
          return prev; // Not enough funds, do nothing
        }
        
        // Add trade to history only if portfolio changed
        setTradeHistory(prevHistory => [
          { 
            id: new Date().toISOString(), 
            type: signal, 
            price, 
            amountBtc: tradeAmountUsd / price,
            time: new Date().toLocaleTimeString() 
          },
          ...prevHistory
        ].slice(0, 50)); // Keep history to 50 trades

        return newPortfolio;
    });

  }, []);

  useEffect(() => {
    if (!isRunning || data.length < 10) return;

    const performAnalysis = async () => {
        if (isAnalyzing) return;
        setIsAnalyzing(true);
        try {
            const insight = await getTradingInsight(data, apiKey);
            setLastAutoInsight(insight);
            const latestPrice = data[data.length - 1].price;

            // Execute trade only on high-confidence signals
            if ((insight.signal === TradingSignal.BUY || insight.signal === TradingSignal.SELL) && insight.confidence > 60) {
                executeTrade(insight.signal, latestPrice);
            }
        } catch (e) {
            console.error("Auto-analysis failed", e);
            setLastAutoInsight({
                signal: TradingSignal.HOLD,
                reasoning: "An error occurred during analysis.",
                confidence: 0
            });
        } finally {
            setIsAnalyzing(false);
        }
    };
    
    performAnalysis(); // Run once immediately when enabled
    const intervalId = setInterval(performAnalysis, ANALYSIS_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isRunning, data, apiKey, executeTrade, isAnalyzing]);

  const latestPrice = data.length > 0 ? data[data.length - 1].price : 0;
  const totalPortfolioValue = portfolio.usd + (portfolio.btc * latestPrice);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 animate-fade-in">
      <div className="lg:col-span-3 space-y-6">
        <PriceChart data={data} />
        <TradeHistory trades={tradeHistory} />
      </div>
      <div className="lg:col-span-2 space-y-6">
        <Portfolio portfolio={portfolio} totalValue={totalPortfolioValue} />
        <BotStatus isRunning={isRunning} onToggle={setIsRunning} isAnalyzing={isAnalyzing} />
        <AiInsight cryptoData={data} apiKey={apiKey} lastAutoInsight={lastAutoInsight} />
      </div>
    </div>
  );
};

export default Dashboard;
