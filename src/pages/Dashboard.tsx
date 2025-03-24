import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EyeOff, QrCode, Send, ArrowLeftRight } from 'lucide-react';
import { Connection } from '@solana/web3.js';
import TokenList from '../components/TokenList';
import Navigation from '../components/Navigation';
import Header from '../components/Header';
import { useTheme } from '../context/ThemeContext';
import axios from 'axios';

export interface Token {
  mint: string;
  symbol: string;
  name: string;
  amount: number;
  value: number;
  change: number;
  decimals: number;
}

// Access environment variables
const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:5000';
const SOLANA_RPC_URL = import.meta.env.VITE_REACT_APP_SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const SOLANA_CONNECTION = new Connection(SOLANA_RPC_URL);

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  
  const [balance, setBalance] = useState(0);
  const [showBalance, setShowBalance] = useState(true);
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);

  useEffect(() => {
    const storedPublicKey = localStorage.getItem('walletPublicKey');
    if (!storedPublicKey) {
      setError("Public key not found. Please create or import a wallet.");
      setLoading(false);
      return;
    }

    setPublicKey(storedPublicKey);
    fetchWalletData(storedPublicKey);
    fetchBalance(storedPublicKey);
  }, []);

  // const fetchWalletData = async (walletPublicKey: string) => {
  //   try {
  //     setLoading(true);
  //     setError(null);

  //     const response = await axios.get(`${BACKEND_URL}/api/wallet/tokens/${walletPublicKey}`);
  //     if (response.status === 200) {
  //       setTokens(response.data.tokens || []);
  //     } else {
  //       throw new Error(`Failed to fetch wallet data. Status: ${response.status}`);
  //     }
  //   } catch (error) {
  //     setError("Failed to load your tokens. Please check your connection and try again.");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

const fetchWalletData = async (walletPublicKey: string) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/wallet/tokens/${walletPublicKey}`);
      if (response.status === 200) {
        setTokens(response.data.tokens || []);
      }
    } catch (error) {
      setError("Failed to load your tokens.");
    }
  };

  const fetchBalance = async (walletPublicKey: string) => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/wallet/balance/${walletPublicKey}`);
      if (response.status === 200) {
        setBalance(response.data.balance);
      } else {
        throw new Error("Failed to fetch balance.");
      }
    } catch (error) {
      setError("Failed to load your balance.");
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white text-red-500">
        <p>{error}</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
        >
          Create or Import Wallet
        </button>
      </div>
    );
  }

  return (
    <div className={`h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
      <Header />

      <div className="p-6">
        <div className="bg-gray-100 rounded-xl p-4">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <p className="text-gray-600 flex items-center gap-1">
                Balance
                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="hover:bg-gray-200 p-1 rounded"
                  aria-label="Toggle balance visibility"
                >
                  <EyeOff size={16} className="text-gray-500" />
                </button>
              </p>
              <span className="bg-green-500 text-white text-sm font-medium px-2 py-1 rounded-md">
                Devnet
              </span>
            </div>

            {showBalance ? (
              <h2 className="text-4xl font-bold mt-2">
                {balance.toFixed(2)} SOL
              </h2>
            ) : (
              <div className="h-12 bg-gray-200 rounded-md w-48 mt-2"></div>
            )}
          </div>

          <div className="bg-white rounded-lg flex justify-between items-center p-3 shadow-md">
            <button
              onClick={() => navigate("/send")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Send funds"
            >
              <Send size={33} className="text-black" />
            </button>

            <button
              onClick={() => navigate("/swap")}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Swap assets"
            >
              <ArrowLeftRight size={33} className="text-black" />
            </button>

            <button
              onClick={() => navigate(`/receive/${publicKey}`)} 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Receive funds"
            >
              <QrCode size={33} className="text-black" />
            </button>
          </div>
        </div>
      </div>

      {tokens.length > 0 ? (
        <TokenList tokens={tokens} />
      ) : (
        <p className="text-center text-gray-600 mt-6">No tokens found.</p>
      )}

      <Navigation />
    </div>
  );
};

export default Dashboard;