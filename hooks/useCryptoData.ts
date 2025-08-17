import { useState, useEffect, useCallback } from 'react';
import { CryptoDataPoint } from '../types';

const API_URL = 'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd';
const MAX_DATA_POINTS = 50;
const FETCH_INTERVAL = 15000; // 15 seconds

const useCryptoData = () => {
  const [data, setData] = useState<CryptoDataPoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPrice = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) {
        throw new Error(`Failed to fetch price: ${response.statusText}`);
      }
      const result = await response.json();
      const price = result.bitcoin?.usd;
      
      if (typeof price !== 'number') {
        throw new Error('Invalid price data received from API.');
      }

      const newPoint: CryptoDataPoint = {
        time: new Date().toLocaleTimeString(),
        price: parseFloat(price.toFixed(2)),
      };
      
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
          setError("An unknown error occurred.");
      }
    }
  }, []);
  
  // Initial data fetch
  useEffect(() => {
    const fetchInitialData = async () => {
        // For the chart to look nice on load, we pre-fill with one point.
        // A full historical fetch could be implemented here.
        await fetchPrice();
    };
    fetchInitialData();
  }, [fetchPrice]);


  useEffect(() => {
    const intervalId = setInterval(fetchPrice, FETCH_INTERVAL);
    return () => clearInterval(intervalId);
  }, [fetchPrice]);

  return { data, error };
};

export default useCryptoData;