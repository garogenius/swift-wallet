import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

const marketData = [
  {
    name: 'Solana',
    symbol: 'SOL',
    price: '$123.45',
    change: '+5.67%',
    marketCap: '$53.2B',
    image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
  },
  {
    name: 'USD Coin',
    symbol: 'USDC',
    price: '$1.00',
    change: '+0.01%',
    marketCap: '$42.1B',
    image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
  },
  {
    name: 'Swift Coin',
    symbol: 'SWG',
    price: '$1.00',
    change: '+0.01%',
    marketCap: '$42.1B',
    image: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png'
  },
 
];

const Market = () => {
  const { theme } = useTheme();
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
    <Header publicKey="TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" />

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Market</h1>

        <div className={`relative mb-6`}>
          <input
            type="text"
            placeholder="Search tokens..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full p-3 pl-10 rounded-lg ${
              theme === 'dark' 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-100 text-gray-900'
            }`}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
        </div>

        <div className="space-y-4">
          {marketData.map((token, index) => (
            <div 
              key={index}
              className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={token.image} alt={token.name} className="w-10 h-10 rounded-full" />
                  <div>
                    <h3 className="font-semibold">{token.name}</h3>
                    <p className="text-sm text-gray-500">{token.symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">{token.price}</p>
                  <p className={token.change.startsWith('+') ? 'text-green-500' : 'text-red-500'}>
                    {token.change}
                  </p>
                </div>
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Market Cap: {token.marketCap}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default Market;