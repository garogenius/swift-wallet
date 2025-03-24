import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { EyeOff, QrCode, Send, ArrowLeftRight, Loader2 } from 'lucide-react';
import { Connection, PublicKey } from '@solana/web3.js';
import TokenList from '../components/TokenList';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';
import { useWallet } from '../context/WalletContext';

export interface Token {
  mint: string;
  symbol: string;
  name: string;
  amount: number;
  value: number;
  change: number;
  decimals: number;
  owner: string;
  amountRaw: string;
}

// Access environment variables
const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:5000';
const SOLANA_RPC_URL = import.meta.env.VITE_REACT_APP_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const SOLANA_CONNECTION = new Connection(SOLANA_RPC_URL);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  
  const [balance, setBalance] = useState<number>(0);
  const [showBalance, setShowBalance] = useState<boolean>(true);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  useEffect(() => {
    const initializeWalletData = async () => {
      try {
        // Check if we're coming from auth with wallet in state
        const state = location.state;
        if (state?.walletPublicKey) {
          localStorage.setItem('walletPublicKey', state.walletPublicKey);
          setPublicKey(state.walletPublicKey);
          await fetchWalletData(state.walletPublicKey);
          await fetchBalance(state.walletPublicKey);
          setLoading(false);
          return;
        }

        // Fallback to localStorage
        const storedPublicKey = localStorage.getItem('walletPublicKey');
        if (!storedPublicKey) {
          navigate('/auth', { state: { from: location.pathname } });
          return;
        }

        setPublicKey(storedPublicKey);
        await fetchWalletData(storedPublicKey);
        await fetchBalance(storedPublicKey);
        setLoading(false);
      } catch (error) {
        setError("Failed to initialize wallet data");
        setLoading(false);
      }
    };

    initializeWalletData();
  }, [location]);

  const fetchWalletData = async (walletPublicKey: string) => {
    try {
      setError(null);
      const response = await axios.get(`${BACKEND_URL}/api/wallet/tokens/${walletPublicKey}`);
      
      if (response.data.success) {
        const transformedTokens = response.data.tokens.map((token: any) => ({
          mint: token.mint,
          symbol: token.mint.slice(0, 4),
          name: `Token (${token.mint.slice(0, 4)}...)`,
          amount: token.amount || 0,
          value: 0,
          change: 0,
          decimals: token.decimals || 0,
          owner: token.owner,
          amountRaw: token.amountRaw
        }));
        
        setTokens(transformedTokens);
      } else {
        throw new Error(response.data.error || 'Failed to fetch tokens');
      }
    } catch (error) {
      console.error('Error fetching tokens:', error);
      setError(error.response?.data?.error || error.message || 'Failed to load your tokens.');
      setTokens([]);
    }
  };

  const fetchBalance = async (walletPublicKey: string) => {
    try {
      const publicKey = new PublicKey(walletPublicKey);
      const balance = await SOLANA_CONNECTION.getBalance(publicKey);
      setBalance(balance / 10**9);
    } catch (error) {
      console.error('Error fetching balance:', error);
      setError("Failed to load your balance.");
      setBalance(0);
    }
  };

  const handleRefresh = async () => {
    if (!publicKey) return;
    
    setRefreshing(true);
    try {
      await Promise.all([
        fetchWalletData(publicKey),
        fetchBalance(publicKey)
      ]);
    } finally {
      setRefreshing(false);
    }
  };

  if (loading) {
    return (
      <div className={`h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <Loader2 className="animate-spin h-12 w-12 text-teal-500" />
      </div>
    );
  }

  if (!publicKey) {
    return (
      <div className={`h-screen flex flex-col items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
        <p className={`mb-4 ${theme === 'dark' ? 'text-red-400' : 'text-red-500'}`}>
          Wallet not connected
        </p>
        <button
          onClick={() => navigate('/auth')}
          className={`p-2 rounded-lg ${theme === 'dark' ? 'bg-teal-600 hover:bg-teal-700' : 'bg-teal-500 hover:bg-teal-600'} text-white`}
        >
          Connect Wallet
        </button>
      </div>
    );
  }

  return (
    <div className={`h-screen flex flex-col ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Header />

      <div className="p-6 flex-1 overflow-y-auto">
        <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>Balance</p>
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className={`p-1 rounded ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-200'}`}
                  aria-label="Toggle balance visibility"
                >
                  <EyeOff size={16} className={theme === 'dark' ? 'text-gray-400' : 'text-gray-500'} />
                </button>
              </div>
              <span className="bg-green-500 text-white text-sm font-medium px-2 py-1 rounded-md">
                Devnet
              </span>
            </div>

            {showBalance ? (
              <h2 className="text-4xl font-bold mt-2">
                {balance.toFixed(2)} SOL
              </h2>
            ) : (
              <div className={`h-12 rounded-md w-48 mt-2 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
            )}
          </div>

          <div className={`rounded-lg flex justify-between items-center p-3 ${theme === 'dark' ? 'bg-gray-700' : 'bg-white'} shadow-md`}>
            <button
              onClick={() => navigate("/send")}
              className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
              aria-label="Send funds"
            >
              <Send size={33} className={theme === 'dark' ? 'text-white' : 'text-black'} />
            </button>

            <button
              onClick={() => navigate("/swap")}
              className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
              aria-label="Swap assets"
            >
              <ArrowLeftRight size={33} className={theme === 'dark' ? 'text-white' : 'text-black'} />
            </button>

            <button
              onClick={() => navigate(`/receive/${publicKey}`)} 
              className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
              aria-label="Receive funds"
            >
              <QrCode size={33} className={theme === 'dark' ? 'text-white' : 'text-black'} />
            </button>

            <button
              onClick={handleRefresh}
              className={`p-2 rounded-full transition-colors ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}
              aria-label="Refresh data"
              disabled={refreshing}
            >
              <Loader2 size={33} className={`${theme === 'dark' ? 'text-white' : 'text-black'} ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="mt-6">
          {error && (
            <div className={`p-3 rounded-lg mb-4 ${theme === 'dark' ? 'bg-red-900 text-red-200' : 'bg-red-100 text-red-700'}`}>
              {error}
              <button 
                onClick={() => setError(null)} 
                className="float-right font-bold"
              >
                ×
              </button>
            </div>
          )}

      <TokenList walletPublicKey={publicKey.toString()} />

        </div>
      </div>

      <Navigation />
    </div>
  );
};

export default Dashboard;