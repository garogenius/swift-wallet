import React from 'react';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

const comingSoonApps = [
  {
    name: 'DeFi Lending',
    description: 'Lend and borrow assets with competitive rates',
    status: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1633158829585-23ba8f7c8caf?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'NFT Marketplace',
    description: 'Trade unique digital assets securely',
    status: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'Yield Farming',
    description: 'Earn rewards by providing liquidity',
    status: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=200'
  },
  {
    name: 'Token Swap',
    description: 'Exchange tokens instantly with low fees',
    status: 'Coming Soon',
    image: 'https://images.unsplash.com/photo-1642104704074-907c0698b98d?auto=format&fit=crop&q=80&w=200'
  }
];

const Apps = () => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
     <Header publicKey="TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" />

      <div className="p-4">
        <h1 className="text-2xl font-bold mb-6">Solana Apps</h1>
        
        <div className="grid grid-cols-2 gap-4">
          {comingSoonApps.map((app, index) => (
            <div 
              key={index}
              className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}
            >
              <img 
                src={app.image} 
                alt={app.name}
                className="w-full h-32 object-cover rounded-lg mb-4"
              />
              <h3 className="font-semibold mb-1">{app.name}</h3>
              <p className="text-sm text-gray-500 mb-2">{app.description}</p>
              <span className="inline-block px-3 py-1 rounded-full text-sm bg-teal-500 text-white">
                {app.status}
              </span>
            </div>
          ))}
        </div>
      </div>
      <Navigation />
    </div>
  );
};

export default Apps;