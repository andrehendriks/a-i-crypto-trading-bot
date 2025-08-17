import React, { useState, useEffect, useCallback } from 'react';
import PriceChart from './PriceChart';
import AiInsight from './AiInsight';
import BotStatus from './BotStatus';
import Portfolio from './Portfolio';
import TradeHistory from './TradeHistory';
import useCryptoData from '../hooks/useCryptoData';
import { Portfolio as PortfolioType, Trade, AiInsight as AiInsightType, BotStatus as BotStatusType } from '../types';
import { getBotStatus, startBot, stopBot, getPortfolio, getTradeHistory, getLatestInsight } from '../server/api';
import LiveModeWarning from './LiveModeWarning';

const STATUS_REFRESH_INTERVAL = 5000; // 5 seconds

const Dashboard: React.FC = () => {
  const { data, error: dataError } = useCryptoData();
  const [botStatus, setBotStatus] = useState<BotStatusType>({ isRunning: false, isAnalyzing: false, statusMessage: 'Offline' });
  const [portfolio, setPortfolio] = useState<PortfolioType>({ eur: 0, btc: 0 });
  const [tradeHistory, setTradeHistory] = useState<Trade[]>([]);
  const [lastAutoInsight, setLastAutoInsight] = useState<AiInsightType | null>(null);

  const refreshStatus = useCallback(async () => {
    try {
        const [status, portfolioData, historyData, insightData] = await Promise.all([
            getBotStatus(),
            getPortfolio(),
            getTradeHistory(),
            getLatestInsight()
        ]);
        setBotStatus(status);
        setPortfolio(portfolioData);
        setTradeHistory(historyData);
        setLastAutoInsight(insightData);
    } catch (error) {
        console.error("Failed to refresh bot status:", error);
        setBotStatus({ isRunning: false, isAnalyzing: false, statusMessage: 'Error fetching status.' });
    }
  }, []);

  useEffect(() => {
    refreshStatus(); // Initial fetch
    const intervalId = setInterval(refreshStatus, STATUS_REFRESH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [refreshStatus]);

  const handleToggleBot = async (shouldRun: boolean) => {
    if (shouldRun) {
        await startBot();
    } else {
        await stopBot();
    }
    await refreshStatus();
  };

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
    <div className="space-y-6 animate-fade-in">
      <LiveModeWarning />
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <PriceChart data={data} />
          <TradeHistory trades={tradeHistory} />
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Portfolio portfolio={portfolio} totalValue={totalPortfolioValue} />
          <BotStatus 
            isRunning={botStatus.isRunning} 
            onToggle={handleToggleBot} 
            isAnalyzing={botStatus.isAnalyzing}
            statusMessage={botStatus.statusMessage}
          />
          <AiInsight cryptoData={data} lastAutoInsight={lastAutoInsight} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;