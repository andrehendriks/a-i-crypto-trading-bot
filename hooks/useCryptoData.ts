
import { useState, useEffect, useCallback } from 'react';
import { CryptoDataPoint } from '../types';

const useCryptoData = (initialPrice: number, volatility: number, interval: number) => {
  const [data, setData] = useState<CryptoDataPoint[]>([]);

  const generateInitialData = useCallback(() => {
    const now = new Date();
    let price = initialPrice;
    const initialData: CryptoDataPoint[] = [];
    for (let i = 50; i > 0; i--) {
        price += (Math.random() - 0.5) * volatility * 2;
        price = Math.max(price, initialPrice - volatility * 10); // Prevent drastic drops
        const time = new Date(now.getTime() - i * interval);
        initialData.push({
            time: time.toLocaleTimeString(),
            price: parseFloat(price.toFixed(2)),
        });
    }
    setData(initialData);
  }, [initialPrice, volatility, interval]);

  const addDataPoint = useCallback(() => {
    setData(prevData => {
      const lastPoint = prevData[prevData.length - 1];
      const newPrice = lastPoint.price + (Math.random() - 0.5) * volatility;
      const newPoint: CryptoDataPoint = {
        time: new Date().toLocaleTimeString(),
        price: parseFloat(Math.max(newPrice, 0).toFixed(2)),
      };
      const newData = [...prevData, newPoint];
      if (newData.length > 50) {
        return newData.slice(newData.length - 50);
      }
      return newData;
    });
  }, [volatility]);

  useEffect(() => {
    generateInitialData();
    const dataInterval = setInterval(addDataPoint, interval);
    return () => clearInterval(dataInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateInitialData, addDataPoint, interval]);

  return { data, addDataPoint };
};

export default useCryptoData;