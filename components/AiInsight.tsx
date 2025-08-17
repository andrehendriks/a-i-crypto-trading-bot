import React, { useState, useCallback, useEffect } from 'react';
import { CryptoDataPoint, AiInsight as AiInsightType, TradingSignal } from '../types';
import { getTradingInsight } from '../services/geminiService';

interface AiInsightProps {
  cryptoData: CryptoDataPoint[];
  apiKey: string;
  lastAutoInsight: AiInsightType | null;
}

const SignalIcon: React.FC<{ signal: TradingSignal }> = ({ signal }) => {
    const baseClasses = "w-6 h-6";
    switch(signal) {
        case TradingSignal.BUY:
            return <svg xmlns="http://www.w3.org/2000/svg" className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;
        case TradingSignal.SELL:
            return <svg xmlns="http://www.w3.org/2000/svg" className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>;
        case TradingSignal.HOLD:
            return <svg xmlns="http://www.w3.org/2000/svg" className={baseClasses} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
        default:
            return null;
    }
};

const AiInsight: React.FC<AiInsightProps> = ({ cryptoData, apiKey, lastAutoInsight }) => {
  const [manualInsight, setManualInsight] = useState<AiInsightType | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const insight = manualInsight || lastAutoInsight;

  const fetchInsight = useCallback(async () => {
    setLoading(true);
    setError(null);
    setManualInsight(null);
    try {
      const result = await getTradingInsight(cryptoData, apiKey);
      setManualInsight(result);
    } catch (e) {
      setError('Failed to get insight from AI. Please try again.');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [cryptoData, apiKey]);

  useEffect(() => {
    setManualInsight(null);
  }, [lastAutoInsight]);

  const getSignalClasses = (signal: TradingSignal | undefined) => {
    switch(signal) {
        case TradingSignal.BUY: return 'bg-green-500/20 text-green-400 border-green-500/50';
        case TradingSignal.SELL: return 'bg-red-500/20 text-red-400 border-red-500/50';
        case TradingSignal.HOLD: return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50';
        default: return 'bg-gray-600/20 text-gray-300 border-gray-500/50';
    }
  };
  
  const signalText = insight?.signal || 'Awaiting Signal';
  const reasoningText = insight?.reasoning || 'Enable auto-trading or click "Analyze Now" to get the latest AI-powered trading signal.';


  return (
    <div className="bg-gray-800/50 border border-cyan-400/20 rounded-xl p-6 shadow-lg space-y-4">
       <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-100">AI Trading Analysis</h3>
        {insight && !manualInsight && !loading && (
            <span className="text-xs text-cyan-400/70 uppercase font-mono">From Auto-Trader</span>
        )}
      </div>
      
      <div className={`flex items-center justify-between p-4 rounded-lg border ${getSignalClasses(insight?.signal)}`}>
        <div className="flex items-center gap-3">
          {insight?.signal && <SignalIcon signal={insight.signal} />}
          <span className="font-bold text-lg uppercase tracking-wider">{signalText}</span>
        </div>
        {insight && (
            <span className="text-sm font-roboto-mono">Conf: {insight.confidence.toFixed(1)}%</span>
        )}
      </div>

      <div className="bg-gray-900/50 p-4 rounded-lg min-h-[120px]">
        {loading && <div className="flex justify-center items-center h-full"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div></div>}
        {error && <p className="text-red-400 text-center">{error}</p>}
        {!loading && !error && <p className="text-gray-300">{reasoningText}</p>}
      </div>

      <button
        onClick={fetchInsight}
        disabled={loading}
        className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 disabled:transform-none flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-900"></div>
            <span>Analyzing...</span>
          </>
        ) : (
          'Analyze Now'
        )}
      </button>
    </div>
  );
};

export default AiInsight;
