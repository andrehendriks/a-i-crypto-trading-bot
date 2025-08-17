
import React, { useState } from 'react';
import { TradingMode } from '../types';

interface ApiFormProps {
  onConnect: (apiKey: string, apiSecret: string, mode: TradingMode) => void;
}

const ApiForm: React.FC<ApiFormProps> = ({ onConnect }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [apiSecret, setApiSecret] = useState<string>('');
  const [riskAcknowledged, setRiskAcknowledged] = useState<boolean>(false);
  const [mode, setMode] = useState<TradingMode>('demo');


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === 'demo' || riskAcknowledged) {
      onConnect(apiKey, apiSecret, mode);
    }
  };

  return (
    <div className="bg-gray-800 border border-cyan-400/30 rounded-xl shadow-2xl shadow-cyan-500/10 p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-cyan-400 mb-2">Connect to Exchange</h2>
      <p className="text-center text-gray-400 mb-6">Enter your credentials to begin.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Trading Mode</label>
            <div className="grid grid-cols-2 gap-2 rounded-lg bg-gray-700 p-1">
                <button type="button" onClick={() => setMode('demo')} className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${mode === 'demo' ? 'bg-cyan-500 text-gray-900' : 'text-gray-300 hover:bg-gray-600'}`}>
                    Demo Trading
                </button>
                <button type="button" onClick={() => setMode('live')} className={`px-4 py-2 text-sm font-bold rounded-md transition-colors ${mode === 'live' ? 'bg-red-500 text-white' : 'text-gray-300 hover:bg-gray-600'}`}>
                    Live Trading
                </button>
            </div>
        </div>
        <div>
          <label htmlFor="apiKey" className="block text-sm font-medium text-gray-300 mb-2">
            API Key
          </label>
          <input
            id="apiKey"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="********************"
            className="font-roboto-mono w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
            required
          />
        </div>
        <div>
          <label htmlFor="apiSecret" className="block text-sm font-medium text-gray-300 mb-2">
            API Secret
          </label>
          <input
            id="apiSecret"
            type="password"
            value={apiSecret}
            onChange={(e) => setApiSecret(e.target.value)}
            placeholder="********************"
            className="font-roboto-mono w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition"
            required
          />
        </div>

        {mode === 'live' ? (
             <div className="bg-red-900/50 border border-red-500/50 text-red-300 text-xs rounded-lg p-3 space-y-3">
                <p className="font-bold text-base text-red-200">SECURITY WARNING: DEMONSTRATION ONLY</p>
                <p>
                    Live Trading mode is for demonstration purposes. For your security, <span className="font-bold">NEVER enter real API keys into a frontend application.</span>
                </p>
                <p>
                    This application does not execute real trades. You are responsible for any actions you take based on its analysis.
                </p>
            </div>
        ) : (
            <div className="bg-cyan-900/50 border border-cyan-500/50 text-cyan-200 text-xs rounded-lg p-3">
                <p className="font-bold text-base text-cyan-100">Demo Mode</p>
                <p>You are in Demo Mode. Your portfolio and trade history will be saved in your browser for this session.</p>
            </div>
        )}

        {mode === 'live' && (
            <div className="flex items-start">
                <div className="flex items-center h-5">
                    <input 
                        id="risk-acknowledged" 
                        type="checkbox" 
                        checked={riskAcknowledged}
                        onChange={(e) => setRiskAcknowledged(e.target.checked)}
                        className="focus:ring-red-500 h-4 w-4 text-red-600 bg-gray-700 border-gray-600 rounded"
                    />
                </div>
                <div className="ml-3 text-sm">
                    <label htmlFor="risk-acknowledged" className="font-medium text-gray-300">
                        I acknowledge that this is a demonstration and no real funds will be traded.
                    </label>
                </div>
            </div>
        )}

        <button
          type="submit"
          disabled={mode === 'live' && !riskAcknowledged}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
        >
          Connect
        </button>
      </form>
    </div>
  );
};

export default ApiForm;
