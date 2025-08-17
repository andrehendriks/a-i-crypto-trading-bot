import React from 'react';
import { Trade } from '../types';

interface TradeHistoryProps {
  trades: Trade[];
}

const HistoryIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v5"></path>
        <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
        <path d="M2 17h4"></path><path d="M4 15v4"></path>
        <path d="M9 15h2l-3 4-3-4h2"></path>
    </svg>
);

const TradeHistory: React.FC<TradeHistoryProps> = ({ trades }) => {
  return (
    <div className="bg-gray-800/50 border border-cyan-400/20 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <HistoryIcon className="w-6 h-6 text-cyan-400"/>
        <h3 className="text-xl font-bold text-gray-100">Trade History</h3>
      </div>
      <div className="max-h-96 overflow-y-auto space-y-3 pr-2">
        {trades.length === 0 ? (
          <p className="text-gray-500 text-center py-10">No trades executed yet.</p>
        ) : (
          trades.map((trade) => (
            <div key={trade.id} className="bg-gray-900/50 p-3 rounded-lg flex justify-between items-center text-sm">
              <div className="flex items-center gap-3">
                 <span className={`font-bold uppercase ${trade.type === 'BUY' ? 'text-green-400' : 'text-red-400'}`}>
                    {trade.type}
                 </span>
                 <div className="font-roboto-mono">
                    <p className="text-gray-100">{trade.amountBtc.toFixed(6)} BTC</p>
                    <p className="text-gray-400">@ ${trade.price.toLocaleString()}</p>
                 </div>
              </div>
              <span className="text-gray-500 font-roboto-mono">{trade.time}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default TradeHistory;
