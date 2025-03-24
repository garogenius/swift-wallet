import React, { useState } from 'react';
import axios from 'axios';

const SendPage = () => {
  const [toAddress, setToAddress] = useState('');
  const [amount, setAmount] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL || 'http://localhost:5000';

  const handleSend = async () => {
    try {
      const response = await axios.post(`${BACKEND_URL}/api/wallet/send`, {
        fromPrivateKey: localStorage.getItem('walletPrivateKey'),
        toPublicKey: toAddress,
        amount: parseFloat(amount),
      });

      if (response.status === 200) {
        setSuccess('Transaction successful!');
        setError('');
      }
    } catch (err) {
      setError('Transaction failed. Please try again.');
      setSuccess('');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Send Tokens</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Recipient Address"
          value={toAddress}
          onChange={(e) => setToAddress(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleSend}
          className="w-full p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
        >
          Send
        </button>
        {error && <p className="text-red-500">{error}</p>}
        {success && <p className="text-green-500">{success}</p>}
      </div>
    </div>
  );
};

export default SendPage;