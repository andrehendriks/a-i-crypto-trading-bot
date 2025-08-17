import React from 'react';
import { Portfolio as PortfolioType } from '../types';

interface PortfolioProps {
  portfolio: PortfolioType;
  totalValue: number;
}

const PortfolioIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"></path>
        <path d="m3.3 7 8.7 5 8.7-5"></path><path d="M12 22V12"></path>
    </svg>
);


const Portfolio: React.FC<PortfolioProps> = ({ portfolio, totalValue }) => {
  return (
    <div className="bg-gray-800/50 border border-cyan-400/20 rounded-xl p-6 shadow-lg">
      <div className="flex items-center gap-3 mb-4">
        <PortfolioIcon className="w-6 h-6 text-cyan-400" />
        <h3 className="text-xl font-bold text-gray-100">Portfolio</h3>
      </div>
      <div className="space-y-4">
        <div>
            <div className="flex justify-between items-baseline">
                <span className="text-gray-400">Total Value</span>
                <span className="text-2xl font-bold font-roboto-mono text-cyan-400">
                    ${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                <div className="bg-cyan-400 h-1.5 rounded-full" style={{ width: `100%` }}></div>
            </div>
        </div>
        <div className="border-t border-gray-700 my-2"></div>
        <div>
            <div className="flex justify-between items-baseline">
                <span className="text-gray-300">USD Balance</span>
                <span className="font-roboto-mono text-lg">
                    ${portfolio.usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
            </div>
        </div>
        <div>
            <div className="flex justify-between items-baseline">
                <span className="text-gray-300">BTC Holdings</span>
                 <span className="font-roboto-mono text-lg">
                    {portfolio.btc.toFixed(6)} BTC
                </span>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Portfolio;
