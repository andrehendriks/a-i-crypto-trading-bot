
import React, { useState } from 'react';

const BotStatus: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(true);

  return (
    <div className="bg-gray-800/50 border border-cyan-400/20 rounded-xl p-6 shadow-lg">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-xl font-bold text-gray-100">Bot Status</h3>
          <div className="flex items-center gap-2 mt-2">
            <span className={`h-3 w-3 rounded-full ${isRunning ? 'bg-green-400 animate-pulse' : 'bg-red-500'}`}></span>
            <span className={`text-lg ${isRunning ? 'text-green-400' : 'text-red-500'}`}>
              {isRunning ? 'Actively Monitoring' : 'Stopped'}
            </span>
          </div>
        </div>
        <div className="flex items-center">
            <label htmlFor="bot-toggle" className="flex items-center cursor-pointer">
                <div className="relative">
                <input type="checkbox" id="bot-toggle" className="sr-only" checked={isRunning} onChange={() => setIsRunning(!isRunning)} />
                <div className="block bg-gray-600 w-14 h-8 rounded-full"></div>
                <div className="dot absolute left-1 top-1 bg-white w-6 h-6 rounded-full transition-transform"></div>
                </div>
            </label>
            <style>{`
                input:checked ~ .dot {
                    transform: translateX(100%);
                    background-color: #06b6d4;
                }
            `}</style>
        </div>
      </div>
        <p className="text-sm text-gray-400 mt-4">Toggle to start or stop the AI trading analysis. The bot will monitor price action and provide signals when active.</p>
    </div>
  );
};

export default BotStatus;