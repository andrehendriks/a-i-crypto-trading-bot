
import React, { useState } from 'react';

interface ApiFormProps {
  onConnect: (apiKey: string, apiSecret: string) => void;
}

const ApiForm: React.FC<ApiFormProps> = ({ onConnect }) => {
  const [apiKey, setApiKey] = useState<string>('');
  const [apiSecret, setApiSecret] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConnect(apiKey, apiSecret);
  };

  return (
    <div className="bg-gray-800 border border-cyan-400/30 rounded-xl shadow-2xl shadow-cyan-500/10 p-8 animate-fade-in">
      <h2 className="text-2xl font-bold text-center text-cyan-400 mb-2">Connect to Exchange</h2>
      <p className="text-center text-gray-400 mb-6">Enter your API credentials to begin.</p>
      
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
        <div className="bg-yellow-900/50 border border-yellow-500/50 text-yellow-300 text-xs rounded-lg p-3">
          <p>
            <strong>Security Notice:</strong> Your API keys are handled client-side and are not sent to any server. However, always use keys with restricted permissions for trading only.
          </p>
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
        >
          Connect Securely
        </button>
      </form>
    </div>
  );
};

export default ApiForm;