import React, { useState, useEffect, useCallback } from 'react';
import PriceChart from './PriceChart';
import AiInsight from './AiInsight';
import BotStatus from './BotStatus';
import Portfolio from './Portfolio';
import TradeHistory from './TradeHistory';
import useCryptoData from '../hooks/useCryptoData';
import { Portfolio as PortfolioType, Trade, AiInsight as AiInsightType, TradingSignal } from '../types';
import { getTradingInsight } from '../services/geminiService';
import { getPortfolioBalance, placeBuyOrder, placeSellOrder } from '../services/exchangeService';

interface DashboardProps {
    apiKey: string;
}

const ANALYSIS_INTERVAL = 15000; // 15 seconds
const TRADE_AMOUNT_EUR = 500; // Trade a fixed €500 value per transaction

const Dashboard: React.FC<DashboardProps> = ({ apiKey }) => {
  const { data, error: dataError } = useCryptoData();
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [portfolio, setPortfolio] = useState<PortfolioType>({ eur: 0, btc: 0 });
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [lastAutoInsight, setLastAutoInsight] = useState<AiInsightType | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);

  // Fetch initial portfolio balance when component mounts
  useEffect(() => {
    const fetchBalance = async () => {
        // In a real app, you would pass apiSecret securely, likely from a backend
        const initialPortfolio = await getPortfolioBalance(apiKey, 'dummy-secret');
        setPortfolio(initialPortfolio);
    };
    fetchBalance();
  }, [apiKey]);

  const executeTrade = useCallback(async (signal: TradingSignal.BUY | TradingSignal.SELL, price: number) => {
    let tradeResult: { success: boolean; btcAmount: number; } | null = null;
    
    if (signal === TradingSignal.BUY && portfolio.eur >= TRADE_AMOUNT_EUR) {
        tradeResult = await placeBuyOrder(apiKey, 'dummy-secret', TRADE_AMOUNT_EUR, price);
        if(tradeResult.success) {
            setPortfolio(p => ({ eur: p.eur - TRADE_AMOUNT_EUR, btc: p.btc + tradeResult.btcAmount }));
        }
    } else if (signal === TradingSignal.SELL) {
        const btcToSell = TRADE_AMOUNT_EUR / price;
        if (portfolio.btc >= btcToSell) {
            tradeResult = await placeSellOrder(apiKey, 'dummy-secret', TRADE_AMOUNT_EUR, price);
            if(tradeResult.success) {
                setPortfolio(p => ({ eur: p.eur + TRADE_AMOUNT_EUR, btc: p.btc - tradeResult.btcAmount }));
            }
        }
    }

    if (tradeResult?.success) {
         // Add trade to history
        setTradeHistory(prevHistory => [
          { 
            id: new Date().toISOString(), 
            type: signal, 
            price, 
            amountBtc: tradeResult.btcAmount,
            time: new Date().toLocaleTimeString() 
          },
          ...prevHistory
        ].slice(0, 50)); // Keep history to 50 trades
    }

  }, [apiKey, portfolio]);

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
                await executeTrade(insight.signal, latestPrice);
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
    
    performAnalysis(); 
    const intervalId = setInterval(performAnalysis, ANALYSIS_INTERVAL);

    return () => clearInterval(intervalId);
  }, [isRunning, data, apiKey, executeTrade, isAnalyzing]);

  const latestPrice = data.length > 0 ? data[data.length - 1].price : 0;
  const totalPortfolioValue = portfolio.eur + (portfolio.btc * latestPrice);

  if (dataError) {
    return (
        <div className="text-center text-red-400 bg-red-900/50 p-6 rounded-lg">
            <h2 className="text-2xl font-bold">Failed to load price data</h2>
            <p>{dataError}</p>
            <p className="mt-4">Please check your internet connection or try again later. The price feed API might be temporarily unavailable.</p>
        </div>
    )
  }

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
