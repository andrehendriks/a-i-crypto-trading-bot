import { CryptoDataPoint } from '../types';

const API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur';

// Fallback state for when the API fails
let lastKnownPrice = 60000.00; // Start with a reasonable default price for BTC/EUR

/**
 * Fetches the latest BTC/EUR price from the CoinGecko API.
 * If the fetch fails, it provides a simulated price to ensure app continuity.
 * @returns A promise that resolves to a CryptoDataPoint.
 */
export const fetchLatestPrice = async (): Promise<CryptoDataPoint> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }
        const result = await response.json();
        const price = result.bitcoin?.eur;

        if (typeof price !== 'number') {
            throw new Error('Invalid price data received from API.');
        }
        
        lastKnownPrice = price; // Update our last known price with the real one
        return {
            time: new Date().toLocaleTimeString(),
            price: parseFloat(price.toFixed(2)),
        };
    } catch (error) {
        console.warn(`[MarketDataService] Could not fetch live price: ${error instanceof Error ? error.message : 'Unknown Error'}. Using fallback data.`);
        
        // On failure, return a slightly randomized version of the last known price.
        const randomFactor = (Math.random() - 0.5) * (lastKnownPrice * 0.001); // Fluctuate by up to 0.1%
        const simulatedPrice = lastKnownPrice + randomFactor;
        lastKnownPrice = simulatedPrice; // The simulation continues from the new price

        return {
            time: new Date().toLocaleTimeString(),
            price: parseFloat(simulatedPrice.toFixed(2)),
        };
    }
};