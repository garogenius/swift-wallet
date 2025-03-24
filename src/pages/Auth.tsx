// src/pages/Auth.tsx
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Wallet } from '@solana/wallet-adapter-react';

const Auth: React.FC = () => {
  const [walletPublicKey, setWalletPublicKey] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || '/dashboard';

  const handleConnect = (e: React.FormEvent) => {
    e.preventDefault();
    if (walletPublicKey) {
      localStorage.setItem('walletPublicKey', walletPublicKey);
      navigate(from, { state: { walletPublicKey } });
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Connect Wallet</h1>
        <form onSubmit={handleConnect}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Wallet Public Key</label>
            <input
              type="text"
              value={walletPublicKey}
              onChange={(e) => setWalletPublicKey(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter your wallet public key"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-teal-500 text-white p-2 rounded hover:bg-teal-600"
          >
            Connect
          </button>
        </form>
      </div>
    </div>
  );
};

export default Auth;