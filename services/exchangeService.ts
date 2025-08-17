import { Portfolio, Trade } from '../types';
import * as ccxt from 'ccxt';

// ##################################################################
// #  CRITICAL SECURITY WARNING                                     #
// ##################################################################
// #  THIS CODE IS DESIGNED TO RUN ON A SECURE BACKEND SERVER ONLY. #
// #  NEVER, EVER RUN THIS CODE OR STORE API KEYS IN A BROWSER.     #
// #  DOING SO WILL EXPOSE YOUR KEYS AND LEAD TO FINANCIAL LOSS.    #
// ##################################################################

// --- Configuration ---
// In a real backend, these would be loaded from environment variables or a secret manager.
// e.g., const apiKey = process.env.EXCHANGE_API_KEY;
const apiKey = 'cb02568b-126f-4204-b52c-51b390f7b4dd'; // <-- REPLACE on your server
const secret = '655DC0F12C463F23C8A5C0C384C8DE1B'; // <-- REPLACE on your server
const exchangeId = 'okx'; // <-- e.g., 'binance', 'coinbasepro', 'kraken'
const symbol = 'BTC/EUR';
// --- End Configuration ---

const exchangeConstructor = ((ccxt as any).default || ccxt)[exchangeId];

if (!exchangeConstructor) {
    throw new Error(`Exchange '${exchangeId}' not found. Please ensure you are using a valid CCXT exchange ID.`);
}

const exchange = new exchangeConstructor({
    apiKey: apiKey,
    secret: secret,
    // Enable sandbox mode if the exchange supports it, for safe testing.
    // 'options': { 'defaultType': 'future' or 'sandboxMode': true }
});

/**
 * Fetches the current portfolio balance from the exchange.
 * @returns A promise that resolves to the user's portfolio.
 */
export const getPortfolioBalance = async (): Promise<Portfolio> => {
    console.log(`[Exchange] Fetching balance from ${exchangeId}...`);
    try {
        // This must be configured on your backend.
        if (apiKey === 'cb02568b-126f-4204-b52c-51b390f7b4dd' || secret === '655DC0F12C463F23C8A5C0C384C8DE1B') {
            console.warn("[Exchange] Using placeholder API keys. Returning a mock portfolio.");
            return { eur: 10000.00, btc: 0.5 };
        }
        const balance = await exchange.fetchBalance();
        return {
            eur: balance.free['EUR'] || 0,
            btc: balance.free['BTC'] || 0,
        };
    } catch (error) {
        console.error(`[Exchange] Error fetching balance:`, error);
        throw new Error(`Could not fetch balance from ${exchangeId}. Check server logs.`);
    }
};

/**
 * Places a market buy order on the exchange.
 * @param amountEur - The amount in EUR to spend.
 * @returns A promise that resolves to the trade result.
 */
export const placeBuyOrder = async (amountEur: number): Promise<{ success: boolean; btcAmount: number; price: number }> => {
    try {
        const price = (await exchange.fetchTicker(symbol)).last;
        if (!price) throw new Error("Could not fetch current price.");

        const btcAmount = amountEur / price;
        console.log(`%c[Exchange] Placing MARKET BUY for ${btcAmount.toFixed(6)} BTC at ~€${price}`, 'color: #22c55e');

        // For real trading, uncomment the next line.
        // const order = await exchange.createMarketBuyOrder(symbol, btcAmount);
        // console.log('[Exchange] Market buy order placed:', order);

        // For this demo, we'll just log it.
        if (apiKey === 'YOUR_API_KEY_HERE') {
             console.warn("[Exchange] DEMO: Real order not placed. Update API keys on your server.");
        }

        return { success: true, btcAmount, price };
    } catch (error) {
        console.error(`[Exchange] Error placing BUY order:`, error);
        return { success: false, btcAmount: 0, price: 0 };
    }
};

/**
 * Places a market sell order on the exchange.
 * @param amountBtc - The amount in BTC to sell.
 * @returns A promise that resolves to the trade result.
 */
export const placeSellOrder = async (amountEur: number): Promise<{ success:boolean; btcAmount: number; price: number }> => {
    try {
        const price = (await exchange.fetchTicker(symbol)).last;
        if (!price) throw new Error("Could not fetch current price.");

        const btcAmount = amountEur / price;
        console.log(`%c[Exchange] Placing MARKET SELL for ${btcAmount.toFixed(6)} BTC at ~€${price}`, 'color: #ef4444');

        // For real trading, uncomment the next line.
        // const order = await exchange.createMarketSellOrder(symbol, btcAmount);
        // console.log('[Exchange] Market sell order placed:', order);
        
        // For this demo, we'll just log it.
        if (apiKey === 'YOUR_API_KEY_HERE') {
            console.warn("[Exchange] DEMO: Real order not placed. Update API keys on your server.");
        }

        return { success: true, btcAmount, price };
    } catch (error) {
        console.error(`[Exchange] Error placing SELL order:`, error);
        return { success: false, btcAmount: 0, price: 0 };
    }
};

/**
 * In a real backend, you would use a database to persist trade history.
 * For this simulation, we'll use localStorage to keep it simple.
 */
export const saveTradeHistory = async (trades: Trade[]): Promise<void> => {
    localStorage.setItem(`trading_bot_history_real`, JSON.stringify(trades));
};

export const loadTradeHistory = async (): Promise<Trade[]> => {
    const saved = localStorage.getItem(`trading_bot_history_real`);
    return saved ? JSON.parse(saved) : [];
}