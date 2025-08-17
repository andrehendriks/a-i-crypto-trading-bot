
import React from 'react';
import PriceChart from './PriceChart';
import AiInsight from './AiInsight';
import BotStatus from './BotStatus';
import useCryptoData from '../hooks/useCryptoData';

interface DashboardProps {
    apiKey: string;
}

const Dashboard: React.FC<DashboardProps> = ({ apiKey }) => {
  const { data, addDataPoint } = useCryptoData(45000, 100, 2000); // Start price, volatility, interval

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      <div className="lg:col-span-2 space-y-6">
        <PriceChart data={data} />
      </div>
      <div className="space-y-6">
        <BotStatus />
        <AiInsight cryptoData={data} apiKey={apiKey} />
      </div>
    </div>
  );
};

export default Dashboard;