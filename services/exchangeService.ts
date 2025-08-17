
import { Portfolio, TradingMode, Trade } from '../types';

/**
 * NOTE: This service interacts with browser localStorage to create a persistent
 * portfolio for demonstration purposes. It does NOT connect to a real exchange.
 * For production systems, logic handling funds and API keys must reside on a secure backend server.
 */

// Helper functions for localStorage
const savePortfolio = async (portfolio: Portfolio, mode: TradingMode): Promise<void> => {
    localStorage.setItem(`trading_bot_portfolio_${mode}`, JSON.stringify(portfolio));
};

const loadPortfolio = async (mode: TradingMode): Promise<Portfolio | null> => {
    const saved = localStorage.getItem(`trading_bot_portfolio_${mode}`);
    return saved ? JSON.parse(saved) : null;
};

export const saveTradeHistory = async (trades: Trade[], mode: TradingMode): Promise<void> => {
    localStorage.setItem(`trading_bot_history_${mode}`, JSON.stringify(trades));
};

export const loadTradeHistory = async (mode: TradingMode): Promise<Trade[]> => {
    const saved = localStorage.getItem(`trading_bot_history_${mode}`);
    return saved ? JSON.parse(saved) : [];
}

/**
 * Fetches the current portfolio balance.
 * @param mode - The current trading mode ('demo' or 'live').
 * @returns A promise that resolves to the user's portfolio.
 */
export const getPortfolioBalance = async (mode: TradingMode): Promise<Portfolio> => {
  const existingPortfolio = await loadPortfolio(mode);
  if (existingPortfolio) {
    return existingPortfolio;
  }
  
  // Return a default starting portfolio if none is saved
  const defaultPortfolio = mode === 'demo' 
    ? { eur: 100000.00, btc: 1.0 }
    : { eur: 10000.00, btc: 0.5 };
  
  await savePortfolio(defaultPortfolio, mode);
  return defaultPortfolio;
};

/**
 * Places a market buy order.
 * @param amountEur - The amount in EUR to spend.
 * @param price - The current price of BTC.
 * @param mode - The current trading mode ('demo' or 'live').
 * @returns A promise that resolves to the trade result.
 */
export const placeBuyOrder = async (amountEur: number, price: number, mode: TradingMode): Promise<{ success: boolean; btcAmount: number; }> => {
  const btcAmount = amountEur / price;
  console.log(`%c[${mode.toUpperCase()}]: Placing MARKET BUY order for ${btcAmount.toFixed(6)} BTC (€${amountEur})`, 'color: #22c55e');
  
  const currentPortfolio = await getPortfolioBalance(mode);
  if (currentPortfolio.eur >= amountEur) {
    const newPortfolio = {
      eur: currentPortfolio.eur - amountEur,
      btc: currentPortfolio.btc + btcAmount,
    };
    await savePortfolio(newPortfolio, mode);
    return { success: true, btcAmount };
  }
  
  console.error(`[${mode.toUpperCase()}]: INSUFFICIENT FUNDS to place BUY order.`);
  return { success: false, btcAmount: 0 };
};

/**
 * Places a market sell order.
 * @param amountEur - The amount in EUR to sell.
 * @param price - The current price of BTC.
 * @param mode - The current trading mode ('demo' or 'live').
 * @returns A promise that resolves to the trade result.
 */
export const placeSellOrder = async (amountEur: number, price: number, mode: TradingMode): Promise<{ success: boolean; btcAmount: number; }> => {
  const btcAmount = amountEur / price;
  console.log(`%c[${mode.toUpperCase()}]: Placing MARKET SELL order for ${btcAmount.toFixed(6)} BTC (€${amountEur})`, 'color: #ef4444');

  const currentPortfolio = await getPortfolioBalance(mode);
  if (currentPortfolio.btc >= btcAmount) {
     const newPortfolio = {
      eur: currentPortfolio.eur + amountEur,
      btc: currentPortfolio.btc - btcAmount,
    };
    await savePortfolio(newPortfolio, mode);
    return { success: true, btcAmount };
  }
  
  console.error(`[${mode.toUpperCase()}]: INSUFFICIENT FUNDS to place SELL order.`);
  return { success: false, btcAmount: 0 };
};
