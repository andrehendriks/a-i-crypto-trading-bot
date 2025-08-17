import { tradingBot } from './bot';
import { AiInsight, BotStatus, Portfolio, Trade, CryptoDataPoint } from '../types';
import { fetchLatestPrice } from '../services/marketDataService';

/**
 * This file simulates the API layer of a backend server. The frontend calls
 * these functions to interact with the trading bot without having any direct
 * access to the trading logic or API keys.
 */

export const startBot = async (): Promise<void> => {
    console.log("[API] Received request to start bot.");
    tradingBot.start();
};

export const stopBot = async (): Promise<void> => {
    console.log("[API] Received request to stop bot.");
    tradingBot.stop();
};

export const getBotStatus = async (): Promise<BotStatus> => {
    return tradingBot.getStatus();
};

export const getPortfolio = async (): Promise<Portfolio> => {
    return tradingBot.getPortfolio();
};

export const getTradeHistory = async (): Promise<Trade[]> => {
    return tradingBot.getTradeHistory();
};

export const getLatestInsight = async (): Promise<AiInsight | null> => {
    return tradingBot.getLatestInsight();
};

/**
 * API endpoint for the frontend to get the latest price.
 */
export const getLatestPrice = async (): Promise<CryptoDataPoint> => {
    return fetchLatestPrice();
};
