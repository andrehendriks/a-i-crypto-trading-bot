import { useState, useEffect, useCallback } from 'react';
import { CryptoDataPoint } from '../types';
import { getLatestPrice } from '../server/api';

const MAX_DATA_POINTS = 50;
const FETCH_INTERVAL = 15000; // 15 seconds

const useCryptoData = () => {
  const [data, setData] = useState<CryptoDataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = useCallback(async () => {
    try {
      // Call our simulated backend API instead of CoinGecko directly
      const newPoint = await getLatestPrice();
      
      setData(prevData => {
        const newData = [...prevData, newPoint];
        return newData.slice(-MAX_DATA_POINTS);
      });
      setError(null);
    } catch (err) {
      console.error("Error fetching crypto data:", err);
      if (err instanceof Error) {
          setError(err.message);
      } else {
          setError("An unknown error occurred while fetching price data.");
      }
    }
  }, []);
  
  // Initial data fetch
  useEffect(() => {
    fetchPrice();
  }, [fetchPrice]);


  useEffect(() => {
    const intervalId = setInterval(fetchPrice, FETCH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchPrice]);

  return { data, error };
};

export default useCryptoData;