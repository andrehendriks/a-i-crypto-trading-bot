import { CryptoDataPoint } from '../types';

const API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=eur';

/**
 * Fetches the latest BTC/EUR price from the CoinGecko API.
 * This function is intended for server-side use.
 * @returns A promise that resolves to a CryptoDataPoint.
 */
export const fetchLatestPrice = async (): Promise<CryptoDataPoint> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`CoinGecko API responded with status: ${response.status}. Body: ${errorBody}`);
        }
        const result = await response.json();
        const price = result.bitcoin?.eur;

        if (typeof price !== 'number') {
            throw new Error('Invalid price data received from API. Check response structure.');
        }

        return {
            time: new Date().toLocaleTimeString(),
            price: parseFloat(price.toFixed(2)),
        };
    } catch (error) {
        console.error("[MarketDataService] Error fetching latest price:", error);
        // Re-throw the error so the calling function can handle it
        throw error;
    }
};
