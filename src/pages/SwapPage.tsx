import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiArrowLeft, FiChevronDown, FiSearch } from "react-icons/fi";
import { useTheme } from "../context/ThemeContext";
import { ArrowLeft } from "lucide-react";

// Brand colors
const brandPrimary = "rgb(20 184 166)"; // Your teal color
const textColor = "text-black"; // Black text


interface Token {
  address: string;
  symbol: string;
  name: string;
  logoURI?: string;
  decimals: number;
  price?: number;
}

interface MarketData {
  price: number;
  change24h: number;
  volume24h: number;
  high24h: number;
  low24h: number;
  orderBook?: {
    bids: [number, number][];
    asks: [number, number][];
  };
}

const SwapPage: React.FC = () => {
  const { theme } = useTheme();
  const darkMode = theme === "dark";
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"limit" | "market">("limit");
  const [tokens, setTokens] = useState<Token[]>([]);
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showTokenList, setShowTokenList] = useState<"from" | "to" | null>(null);
  const [selectedTokens, setSelectedTokens] = useState({
    from: { symbol: "SOL", address: "So11111111111111111111111111111111111111112" },
    to: { symbol: "USDC", address: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v" }
  });
  const [amount, setAmount] = useState("");
  const [marketData, setMarketData] = useState<MarketData | null>(null);
  const [offerPrice, setOfferPrice] = useState("");
  const [offerAmount, setOfferAmount] = useState("");

  // Fetch token list and market data
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch token list
        const tokenResponse = await axios.get("https://token.jup.ag/all");
        setTokens(tokenResponse.data);
        setFilteredTokens(tokenResponse.data.slice(0, 100));

        // Fetch market data (example with mock data)
        setMarketData({
          price: 24.50,
          change24h: 2.5,
          volume24h: 15000000,
          high24h: 25.20,
          low24h: 23.80,
          orderBook: {
            bids: [
              [24.40, 150],
              [24.35, 200],
              [24.30, 300]
            ],
            asks: [
              [24.55, 120],
              [24.60, 180],
              [24.65, 250]
            ]
          }
        });
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Filter tokens based on search query
  useEffect(() => {
    if (searchQuery) {
      const filtered = tokens.filter(
        token =>
          token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          token.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTokens(filtered.slice(0, 100));
    } else {
      setFilteredTokens(tokens.slice(0, 100));
    }
  }, [searchQuery, tokens]);

  const handleTokenSelect = (token: Token, type: "from" | "to") => {
    setSelectedTokens(prev => ({
      ...prev,
      [type]: { symbol: token.symbol, address: token.address }
    }));
    setShowTokenList(null);
    setSearchQuery("");
  };

  const handleCreateOffer = async () => {
    // Implement your offer creation logic here
    console.log(`Creating offer: ${offerAmount} ${selectedTokens.from.symbol} at ${offerPrice} ${selectedTokens.to.symbol}`);
    // Would typically call your backend API here
    alert(`Offer created: ${offerAmount} ${selectedTokens.from.symbol} @ ${offerPrice} ${selectedTokens.to.symbol}`);
  };

  return (
    
    <div className={`min-h-screen p-6 ${textColor}`}>
      <div className="max-w-md mx-auto">
        {/* Header with back button */}
        <div className="absolute top-6 left-6 flex items-center gap-4">
        <button onClick={() => navigate("/dashboard")} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700">
          <ArrowLeft size={30} className="text-gray-600 dark:text-white" />
        </button>
        <h1 className="text-3xl font-semibold">Swap</h1>
      </div>
      <br/><br/><br/><br/>
        {/* Tabs */}
        <div className="flex mb-4 border-b">
          <button
            className={`pb-2 px-4 ${activeTab === "limit" ? `text-[${brandPrimary}] border-b-2 border-[${brandPrimary}]` : "text-gray-500"}`}
            onClick={() => setActiveTab("limit")}
          >
            Limit
          </button>
          <button 
            className={`pb-2 px-4 ${activeTab === "market" ? `text-[${brandPrimary}] border-b-2 border-[${brandPrimary}]` : "text-gray-500"}`}
            onClick={() => setActiveTab("market")}
          >
            Market
          </button>
        </div>

        {activeTab === "limit" ? (
          /* LIMIT ORDER TAB */
          <>
            {/* From Token Section */}
            <div className="border rounded-lg p-4 mb-4 relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">From</span>
                <div className="flex items-center">
                  <span className="text-gray-500 mr-2">Balance: 0</span>
                  <button className={`text-[${brandPrimary}] text-sm`}>Max</button>
                </div>
              </div>
              <div className="flex items-center">
                <input
                  type="number"
                  className="w-full text-2xl outline-none"
                  placeholder="0"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <button 
                  className={`flex items-center px-3 py-2 rounded-lg ml-2 border`}
                  onClick={() => setShowTokenList("from")}
                >
                  {selectedTokens.from.symbol}
                  <FiChevronDown className="ml-1" />
                </button>
              </div>
            </div>

            {/* To Token Section */}
            <div className="border rounded-lg p-4 mb-6 relative">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500">To</span>
              </div>
              <div className="flex items-center">
                <div className="w-full text-2xl">0</div>
                <button 
                  className={`flex items-center px-3 py-2 rounded-lg ml-2 border`}
                  onClick={() => setShowTokenList("to")}
                >
                  {selectedTokens.to.symbol}
                  <FiChevronDown className="ml-1" />
                </button>
              </div>
            </div>

            <button style={{backgroundColor:"rgb(20 184 166 / var(--tw-bg-opacity, 1))"}}
              className={`w-full py-3 rounded-lg font-medium text-white bg-[${brandPrimary}] hover:opacity-90`}
            >
              Swap
            </button>
          </>
        ) : (
          /* MARKET ORDER TAB */
          <>
            {marketData && (
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">Market Data</h2>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="border p-3 rounded-lg">
                    <div className="text-gray-500">Price</div>
                    <div className="text-xl">${marketData.price.toFixed(2)}</div>
                  </div>
                  <div className="border p-3 rounded-lg">
                    <div className="text-gray-500">24h Change</div>
                    <div className={`text-xl ${marketData.change24h >= 0 ? "text-green-500" : "text-red-500"}`}>
                      {marketData.change24h.toFixed(2)}%
                    </div>
                  </div>
                  <div className="border p-3 rounded-lg">
                    <div className="text-gray-500">24h Volume</div>
                    <div className="text-xl">${marketData.volume24h.toLocaleString()}</div>
                  </div>
                  <div className="border p-3 rounded-lg">
                    <div className="text-gray-500">24h Range</div>
                    <div className="text-xl">
                      ${marketData.low24h.toFixed(2)}-${marketData.high24h.toFixed(2)}
                    </div>
                  </div>
                </div>

                {/* Order Book */}
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Order Book</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-gray-500 mb-2">Bids</h4>
                      {marketData.orderBook?.bids.map(([price, amount], i) => (
                        <div key={`bid-${i}`} className="flex justify-between py-1">
                          <span className="text-green-500">${price.toFixed(2)}</span>
                          <span>{amount}</span>
                        </div>
                      ))}
                    </div>
                    <div>
                      <h4 className="text-gray-500 mb-2">Asks</h4>
                      {marketData.orderBook?.asks.map(([price, amount], i) => (
                        <div key={`ask-${i}`} className="flex justify-between py-1">
                          <span className="text-red-500">${price.toFixed(2)}</span>
                          <span>{amount}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Offer Form */}
            <div className="border rounded-lg p-4 mb-4">
              <h3 className="font-medium mb-3">Create Offer</h3>
              <div className="mb-3">
                <label className="block text-gray-500 mb-1">Price ({selectedTokens.to.symbol})</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={offerPrice}
                  onChange={(e) => setOfferPrice(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <div className="mb-3">
                <label className="block text-gray-500 mb-1">Amount ({selectedTokens.from.symbol})</label>
                <input
                  type="number"
                  className="w-full p-2 border rounded"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(e.target.value)}
                  placeholder="0.00"
                />
              </div>
              <button style={{backgroundColor:"rgb(20 184 166 / var(--tw-bg-opacity, 1))"}}
                onClick={handleCreateOffer}
                className={`w-full py-3 rounded-lg font-medium text-white bg-[${brandPrimary}] hover:opacity-90`}
              >
                Place Offer
              </button>
            </div>
          </>
        )}

        {/* Token Selection Modal */}
        {showTokenList && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md max-h-[70vh] flex flex-col shadow-lg">
              <div className="p-4 border-b flex items-center">
                <FiSearch className="text-gray-400 mr-2" />
                <input
                  type="text"
                  className="w-full outline-none"
                  placeholder="Search token name or symbol"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  autoFocus
                />
                <button 
                  className="ml-2 text-gray-500 hover:text-gray-700"
                  onClick={() => setShowTokenList(null)}
                >
                  ✕
                </button>
              </div>
              <div className="overflow-y-auto">
                {filteredTokens.map((token) => (
                  <div
                    key={token.address}
                    className="flex items-center p-3 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleTokenSelect(token, showTokenList)}
                  >
                    {token.logoURI && (
                      <img 
                        src={token.logoURI} 
                        alt={token.symbol} 
                        className="w-6 h-6 rounded-full mr-3" 
                      />
                    )}
                    <div>
                      <div className="font-medium">{token.symbol}</div>
                      <div className="text-xs text-gray-500">{token.name}</div>
                    </div>
                  </div>
                ))}
                {filteredTokens.length === 0 && (
                  <div className="p-4 text-center text-gray-500">No tokens found</div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapPage;