import React, { useState } from 'react';

interface ApiFormProps {
  onConnect: (apiKey: string, apiSecret: string) => void;
}

const ApiForm: React.FC<ApiFormProps> = ({ onConnect }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [apiSecret, setApiSecret] = useState<string>('');
  const [riskAcknowledged, setRiskAcknowledged] = useState<boolean>(false);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (riskAcknowledged) {
      onConnect(apiKey, apiSecret);
    }
  };

  return (
    <div className="bg-gray-800 border border-cyan-400/30 rounded-xl shadow-2xl shadow-cyan-500/10 p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-cyan-400 mb-2">Connect to Live Exchange</h2>
      <p className="text-center text-gray-400 mb-6">Enter your API credentials to begin live trading.</p>
      
      <form onSubmit={handleSubmit} className="space-y-6">
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
        <div className="bg-red-900/50 border border-red-500/50 text-red-300 text-xs rounded-lg p-3 space-y-3">
          <p className="font-bold text-base text-red-200">WARNING: HIGH RISK ACTIVITY</p>
          <p>
            You are about to connect to a live cryptocurrency exchange. Automated trading involves substantial risk of financial loss. 
            Ensure your API keys have the minimum required permissions for trading and DO NOT enable withdrawal permissions.
          </p>
           <p>
            This application is for educational purposes. You are solely responsible for any financial outcomes.
          </p>
        </div>
        <div className="flex items-start">
            <div className="flex items-center h-5">
                <input 
                    id="risk-acknowledged" 
                    type="checkbox" 
                    checked={riskAcknowledged}
                    onChange={(e) => setRiskAcknowledged(e.target.checked)}
                    className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 bg-gray-700 border-gray-600 rounded"
                />
            </div>
            <div className="ml-3 text-sm">
                <label htmlFor="risk-acknowledged" className="font-medium text-gray-300">
                    I understand the risks of automated trading with real funds and accept full responsibility.
                </label>
            </div>
        </div>
        <button
          type="submit"
          disabled={!riskAcknowledged}
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:bg-gray-600 disabled:cursor-not-allowed disabled:transform-none"
        >
          Connect Securely
        </button>
      </form>
    </div>
  );
};

export default ApiForm;