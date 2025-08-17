import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Area } from 'recharts';
import { CryptoDataPoint } from '../types';

interface PriceChartProps {
  data: CryptoDataPoint[];
}

const PriceChart: React.FC<PriceChartProps> = ({ data }) => {
  const latestPrice = data.length > 0 ? data[data.length - 1].price : 0;
  const firstPrice = data.length > 0 ? data[0].price : 0;
  const priceChange = latestPrice - firstPrice;
  const percentageChange = firstPrice > 0 ? (priceChange / firstPrice) * 100 : 0;
  const isPositive = priceChange >= 0;

  return (
    <div className="bg-gray-800/50 border border-cyan-400/20 rounded-xl p-4 md:p-6 shadow-lg">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <div>
            <h3 className="text-xl font-bold text-gray-100">BTC/USD Live Chart</h3>
            <p className="text-gray-400">Real-time simulated price feed</p>
        </div>
        <div className="text-right mt-2 sm:mt-0">
            <p className="text-3xl font-bold font-roboto-mono">${latestPrice.toLocaleString()}</p>
            <p className={`font-semibold font-roboto-mono ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                {isPositive ? '+' : ''}{priceChange.toFixed(2)} ({percentageChange.toFixed(2)}%)
            </p>
        </div>
      </div>
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer>
          <LineChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
            <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(200, 200, 200, 0.1)" />
            <XAxis dataKey="time" stroke="#9ca3af" tick={{ fontSize: 12 }} />
            <YAxis 
                domain={['dataMin - 100', 'dataMax + 100']} 
                stroke="#9ca3af" 
                tick={{ fontSize: 12 }} 
                tickFormatter={(value) => `$${Number(value).toLocaleString()}`} 
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(23, 37, 84, 0.8)',
                borderColor: '#06b6d4',
                color: '#e5e7eb',
                borderRadius: '0.5rem'
              }}
              labelStyle={{ color: '#ffffff', fontWeight: 'bold' }}
              formatter={(value: number) => [`$${value.toLocaleString()}`, 'Price']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="none"
              fillOpacity={1}
              fill="url(#priceGradient)"
              isAnimationActive={false}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke="#06b6d4"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PriceChart;