import React, { useState, useEffect } from 'react';
import TokenIcon from "./TokenIcon";
import axios from 'axios';

interface Token {
    mint: string;
    symbol: string;
    name: string;
    amount: number;
    value: number;
    decimals: number;
}

interface TokenListProps {
    tokens: Token[];
}

const TokenList: React.FC<TokenListProps> = ({ tokens }) => {
    const [tokenPrices, setTokenPrices] = useState<{ [symbol: string]: number }>({});
    const [loading, setLoading] = useState(false); // Added loading state
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTokenPrices = async () => {
            if (!process.env.COINMARKETCAP_API_KEY) {
                console.error("CoinMarketCap API Key is missing. Please set it in .env file.");
                setError("CoinMarketCap API Key is missing.");
                return; // Stop fetching if the key is missing
            }

            const symbols = tokens.map((token) => token.symbol).join(",");
            setLoading(true);
            setError(null);
            try {
                const response = await axios.get(
                    `https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=${symbols}`,
                    {
                        headers: {
                            "X-CMC_PRO_API_KEY": process.env.COINMARKETCAP_API_KEY,
                        },
                    }
                );

                if (response.status !== 200) {
                    throw new Error(`Failed to fetch prices. Status code: ${response.status}`);
                }

                const data = response.data;
                const newPrices: { [symbol: string]: number } = {};

                if (data.data) {
                    Object.keys(data.data).forEach((symbol) => {
                        const symbolData = data.data[symbol];
                         // Check if quote.USD is defined
                        if (symbolData && symbolData.quote && symbolData.quote.USD) {
                            newPrices[symbol] = symbolData.quote.USD.price;
                        } else {
                             console.warn(`Price data for ${symbol} is missing or incomplete.`);
                            newPrices[symbol] = 0; // Or some default value
                        }
                    });
                }
                setTokenPrices(newPrices);
            } catch (error: any) {
                setError(error.message); // Set the error message
                console.error("Error fetching token prices:", error);
            } finally {
                setLoading(false);
            }
        };

        if (tokens && tokens.length > 0) {
          fetchTokenPrices();
        }
        
    }, [tokens]);

    if (loading) {
        return (
            <div className="mt-6 flex justify-center items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-teal-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="mt-6 p-4 bg-red-100 text-red-700 rounded-md border border-red-400">
                Error: {error}
            </div>
        );
    }

    return (
        <div className="mt-6">
            <div className="flex justify-between items-center text-gray-600 text-sm mb-4">
                <p>Asset</p>
                <p className="flex items-center gap-1">
                    Last 24h <span className="text-xs">▼</span>
                </p>
            </div>

            {tokens.map((token, index) => {
              const price = tokenPrices[token.symbol] || 0;
              const value = token.amount * price;

              return (
                <div
                  key={`${token.mint}-${index}`}
                  className="bg-white rounded-xl p-4 mb-3 flex justify-between items-center shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <TokenIcon symbol={token.symbol} />
                    <div>
                      <p className="font-semibold text-lg">
                        {token.amount.toFixed(4)}
                      </p>
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{token.symbol}</span>
                        <span className="text-gray-500 text-sm">
                          {token.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-lg">${value.toFixed(2)}</p>
                    <p className="text-sm font-medium text-gray-500">
                      {price ? `$${price.toFixed(4)}` : "Price Unavailable"}
                    </p>
                  </div>
                </div>
              );
            })}
        </div>
    );
};

export default TokenList;
