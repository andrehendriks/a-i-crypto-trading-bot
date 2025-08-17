
import React from 'react';

interface HeaderProps {
  isConnected: boolean;
  onDisconnect: () => void;
}

const ChipIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <rect x="7" y="7" width="3" height="3"></rect>
    <rect x="14" y="7" width="3" height="3"></rect>
    <rect x="7" y="14" width="3" height="3"></rect>
    <rect x="14" y="14" width="3" height="3"></rect>
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="12" y1="3" x2="12" y2="21"></line>
  </svg>
);


const Header: React.FC<HeaderProps> = ({ isConnected, onDisconnect }) => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-cyan-400/20 p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <ChipIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-2xl font-bold text-gray-100 tracking-wider">
          AI CRYPTO TRADING BOT
        </h1>
      </div>
      {isConnected && (
        <button
          onClick={onDisconnect}
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M18.36 6.64a9 9 0 1 1-12.73 0"></path><line x1="12" y1="2" x2="12" y2="12"></line></svg>
          Disconnect
        </button>
      )}
    </header>
  );
};

export default Header;