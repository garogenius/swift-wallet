// src/components/SignUp.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Wallet, Upload } from 'lucide-react';
import axios from 'axios';
import { Keypair } from '@solana/web3.js';
import { generateSecurePhrase, encryptData } from '../utils/security';
import { useSecureStorage } from '../hooks/useSecureStorage';
import { Buffer } from 'buffer';

const SignUp = () => {
  const navigate = useNavigate();
  const { storeItem } = useSecureStorage();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [securityPhrase, setSecurityPhrase] = useState<string[]>([]);
  const [importKey, setImportKey] = useState('');
  const [isImportMode, setIsImportMode] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    try {
      const phrase = generateSecurePhrase();
      setSecurityPhrase(phrase);
    } catch (err) {
      setError('Failed to generate recovery phrase. Please refresh the page.');
    }
  }, []);

  const validatePIN = (input: string) => {
    return /^\d{4,}$/.test(input);
  };

  const handleCreateWallet = async () => {
    try {
      if (!validatePIN(pin)) {
        setError('PIN must be at least 4 digits');
        return;
      }
      if (pin !== confirmPin) {
        setError('PINs do not match');
        return;
      }
      if (securityPhrase.length !== 24) {
        setError('Invalid security phrase');
        return;
      }
  
      setLoading(true);
  
      // Generate Solana keypair
      const keypair = Keypair.generate();
  
      // Encrypt private key
      const encryptedKey = await encryptData(
        Buffer.from(keypair.secretKey).toString('hex'),
        pin + import.meta.env.VITE_SALT
      );
  
      // Calculate phrase hash
      const phraseHashBuffer = await window.crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(securityPhrase.join(' '))
      );
      const phraseHash = Array.from(new Uint8Array(phraseHashBuffer));
  
      // Store wallet securely
      await storeItem(
        'wallet',
        JSON.stringify({
          publicKey: keypair.publicKey.toString(),
          encryptedKey,
          phraseHash,
        })
      );
  
      // Save publicKey to localStorage
      localStorage.setItem('walletPublicKey', keypair.publicKey.toString());
  
      // Create wallet in backend
      const response = await axios.post('http://localhost:5000/api/wallet/create', {
        publicKey: keypair.publicKey.toString(),
        encryptedKey,
        securityPhrase: securityPhrase.join(' '),
      });
  
      if (response.status === 201) {
        navigate('/recovery-phrase', { state: { securityPhrase } });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Wallet creation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleImportWallet = async () => {
    try {
      if (!importKey || !validatePIN(pin)) {
        setError('Invalid private key or PIN');
        return;
      }
  
      setLoading(true);
      const keypair = Keypair.fromSecretKey(Buffer.from(importKey, 'hex'));
  
      // Save publicKey to localStorage
      localStorage.setItem('walletPublicKey', keypair.publicKey.toString());
  
      const encryptedKey = await encryptData(
        importKey,
        pin + import.meta.env.VITE_SALT
      );
  
      await storeItem(
        'wallet',
        JSON.stringify({
          publicKey: keypair.publicKey.toString(),
          encryptedKey,
        })
      );
  
      // Verify wallet exists on chain
      const response = await axios.post('/api/wallet/import', {
        publicKey: keypair.publicKey.toString(),
        encryptedKey,
      });
  
      if (response.status === 200) {
        setSuccess(true);
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err) {
      setError('Invalid private key or PIN format');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header Section */}
      <div className="w-full h-55 bg-gradient-to-br from-teal-400 to-teal-600 rounded-bl-[80px] flex-shrink-0">
        <div className="p-8 flex flex-col items-center justify-center h-full">
          <Wallet className="text-white mb-4" size={48} />
          <h1 className="text-white text-4xl font-bold text-center">
            Secure Crypto Wallet
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <div className="max-w-md mx-auto space-y-6">
          <br/>
          {/* Error/Success Messages */}
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>
          )}

          {/* Step 1: Create/Import Wallet */}
          <>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter 4-digit PIN"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />

            <input
              type="password"
              value={confirmPin}
              onChange={(e) => setConfirmPin(e.target.value)}
              placeholder="Confirm PIN"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />

            <button
              onClick={handleCreateWallet}
              disabled={loading}
              className="w-full p-6 bg-white border-2 border-teal-100 rounded-2xl shadow-lg hover:shadow-xl"
            >
              <div className="flex items-center space-x-4">
                <Plus className="text-teal-600" size={24} />
                <div className="text-left">
                  <h3 className="text-lg font-semibold text-gray-800">Create New Wallet</h3>
                </div>
              </div>
            </button>

            <button
              onClick={() => setIsImportMode(true)}
              className="w-full p-3 bg-teal-500 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-teal-600"
            >
              <Upload size={20} />
              <span>Import Wallet</span>
            </button>
          </>
        </div>

        {/* Footer */}
        <p className="text-center mt-6">
          Not have account?{' '}
          <Link to="/login" className="text-teal-500 font-medium hover:text-teal-600">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;