import React from 'react';

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


const Header: React.FC = () => {
  return (
    <header className="bg-gray-900/50 backdrop-blur-sm border-b border-cyan-400/20 p-4 flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <ChipIcon className="w-8 h-8 text-cyan-400" />
        <h1 className="text-2xl font-bold text-gray-100 tracking-wider">
          AI CRYPTO TRADING BOT
        </h1>
      </div>
    </header>
  );
};

export default Header;