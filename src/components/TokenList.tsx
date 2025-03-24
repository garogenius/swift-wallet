import React, { useState, useEffect } from 'react';
import { getTokenBalances } from '../pages/tokenService';
import TokenIcon from './TokenIcon';

interface Token {
  mint: string;
  symbol: string;
  name: string;
  amount: number;
  decimals: number;
  logoURI?: string;
}

const TokenList: React.FC<{ walletPublicKey: string }> = ({ walletPublicKey }) => {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBalances = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const { tokens: fetchedTokens } = await getTokenBalances(walletPublicKey);
        
        if (fetchedTokens.length === 0 || 
            (fetchedTokens.length === 1 && fetchedTokens[0].amount === 0)) {
          setError('No tokens found in this wallet');
        } else {
          setTokens(fetchedTokens);
        }
      } catch (err) {
        console.error('Fetch error:', err);
        setError('Failed to load token balances. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (walletPublicKey) {
      fetchBalances();
    }
  }, [walletPublicKey]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-md bg-red-50 text-red-700 border border-red-200">
        {error}
        {error.includes('Failed') && (
          <button 
            onClick={() => window.location.reload()}
            className="mt-2 text-sm underline"
          >
            Try Again
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tokens.map((token, index) => (
        <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg shadow">
          <div className="flex items-center space-x-3">
            <TokenIcon symbol={token.symbol} logoURI={token.logoURI} size={32} />
            <div>
              <p className="font-medium">{token.symbol}</p>
              <p className="text-sm text-gray-500">{token.name}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="font-medium">{token.amount.toFixed(token.decimals)}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TokenList;