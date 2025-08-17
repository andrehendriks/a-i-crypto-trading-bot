import React from 'react';

const WarningIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line>
    </svg>
);

const LiveModeWarning: React.FC = () => {
  return (
    <div className="bg-yellow-900/50 border border-yellow-500/50 text-yellow-200 rounded-lg p-4 flex items-center gap-4">
      <WarningIcon className="w-8 h-8 text-yellow-400 flex-shrink-0" />
      <div>
        <h4 className="font-bold text-yellow-300">SECURE ARCHITECTURE DEMONSTRATION</h4>
        <p className="text-sm">
          This app now simulates a secure backend. The trading logic runs in a sandboxed `server/` module, and the UI acts as a control panel. 
          To trade with real money, deploy the code in `server/` and `services/` to a secure Node.js environment and configure your API keys there.
        </p>
      </div>
    </div>
  );
};

export default LiveModeWarning;