// src/pages/SelectTokenPage.tsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

// Define the Token interface
interface Token {
  id: string;
  symbol: string;
  name: string;
  current_price: number;
  market_cap: number;
}

const SelectTokenPage = () => {
  const navigate = useNavigate();
  const [tokens, setTokens] = useState<Token[]>([]); // State to store tokens
  const [loading, setLoading] = useState(true); // State to manage loading state
  const [error, setError] = useState(''); // State to manage errors
  const [searchQuery, setSearchQuery] = useState(''); // State for search functionality
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  // Fetch tokens from CoinGecko API
  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await axios.get(
          'https://api.coingecko.com/api/v3/coins/markets',
          {
            params: {
              vs_currency: 'usd',
              order: 'market_cap_desc',
              per_page: 100,
              page: 1,
              sparkline: false,
            },
          }
        );

        if (response.status === 200) {
          setTokens(response.data); // Set tokens from API response
        } else {
          throw new Error('Failed to fetch tokens');
        }
      } catch (err) {
        setError('Failed to load tokens. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchTokens();
  }, []);

  // Handle token selection
  const handleTokenSelect = (token: Token) => {
    navigate(`/send/${token.symbol}`); // Navigate to the send page with the selected token
  };

  // Filter tokens based on search query
  const filteredTokens = tokens.filter((token: Token) =>
    token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    token.symbol.toLowerCase().includes(searchQuery.toLowerCase())
  );
 

  if (loading) {
    return (
     
        <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} p-6`}>      
        {/* Header */}
        <div className="absolute top-6 left-6 flex items-center gap-4">
          <button onClick={() => navigate("/dashboard")} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700">
            <ArrowLeft size={30} className="text-gray-600 dark:text-white" />
          </button>
          <h1 className="text-3xl font-semibold">Tokens</h1>
        </div>

       
        <div className="flex justify-center items-center h-40">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
        </div>
      </div>
    
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-4">Select Token</h1>
        <div className="text-red-500">{error}</div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} p-6`}>  
    <div className="absolute top-6 left-6 flex items-center gap-4">
        <button onClick={() => navigate("/dashboard")} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700">
          <ArrowLeft size={30} className="text-gray-600 dark:text-white" />
        </button>
        <h1 className="text-2xl font-semibold">Tokens</h1>
      </div>    
    {/* <div className="p-6"> */}
      {/* <h1 className="text-2xl font-bold mb-4">Select Token</h1> */}
      <div className="space-y-4">
        {/* Search Input */}
        <br/><br/><br/>
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />

        {/* Token List */}
        {filteredTokens.map((token, index) => (
          <div
            key={index}
            onClick={() => handleTokenSelect(token)}
            className="p-4 bg-white rounded-lg shadow-md cursor-pointer hover:bg-gray-100"
          >
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-bold">{token.name}</h2>
                <p className="text-gray-600">{token.symbol.toUpperCase()}</p>
              </div>
              <p className="text-gray-600">${token.current_price.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
    // </div>
  );
};

export default SelectTokenPage;