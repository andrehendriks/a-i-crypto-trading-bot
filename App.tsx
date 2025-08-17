
import React, { useState, useCallback } from 'react';
import ApiForm from './components/ApiForm';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import { TradingMode } from './types';

const App: React.FC = () => {
  const [apiConnected, setApiConnected] = useState<boolean>(false);
  const [apiKey, setApiKey] = useState<string>('');
  const [tradingMode, setTradingMode] = useState<TradingMode>('demo');
  
  const handleConnect = useCallback((key: string, secret: string, mode: TradingMode) => {
    // In a real app, you would validate these keys.
    // For this demo, we'll just check if they are not empty.
    if (key.trim() && secret.trim()) {
      setApiKey(key);
      setTradingMode(mode);
      setApiConnected(true);
    }
  }, []);

  const handleDisconnect = useCallback(() => {
    setApiKey('');
    setApiConnected(false);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 selection:bg-cyan-400 selection:text-gray-900">
      <Header isConnected={apiConnected} onDisconnect={handleDisconnect} tradingMode={tradingMode} />
      <main className="p-4 sm:p-6 lg:p-8">
        {!apiConnected ? (
          <div className="max-w-md mx-auto mt-10">
            <ApiForm onConnect={handleConnect} />
          </div>
        ) : (
          <Dashboard apiKey={apiKey} tradingMode={tradingMode} />
        )}
      </main>
    </div>
  );
};

export default App;