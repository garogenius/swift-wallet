import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { ethers } from 'ethers';

interface WalletContextType {
  wallet: any;
  publicKey: string | null;
  network: string;
  connection: Connection | null;
  connectWallet: (network: string) => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<any>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [network, setNetwork] = useState<string>('');
  const [connection, setConnection] = useState<Connection | null>(null);

  useEffect(() => {
    if (network.includes('solana')) {
      const rpcUrl = network === 'solana-devnet' 
        ? clusterApiUrl('devnet')
        : clusterApiUrl('mainnet-beta');
      setConnection(new Connection(rpcUrl));
    }
  }, [network]);

  const connectWallet = async (network: string) => {
    try {
      if (network.includes('solana')) {
        const phantom = new PhantomWalletAdapter();
        await phantom.connect();
        const pubKey = phantom.publicKey?.toString();
        if (!pubKey) throw new Error('Failed to connect wallet');
        
        setWallet(phantom);
        setPublicKey(pubKey);
        setNetwork(network);
        localStorage.setItem('walletState', JSON.stringify({
          walletType: 'phantom',
          network,
          publicKey: pubKey
        }));
      } else {
        // Ethereum wallet connection logic
      }
    } catch (error) {
      console.error('Connection error:', error);
      throw error;
    }
  };

  const disconnectWallet = () => {
    if (wallet?.disconnect) wallet.disconnect();
    setWallet(null);
    setPublicKey(null);
    setNetwork('');
    setConnection(null);
    localStorage.removeItem('walletState');
  };

  // Restore wallet connection on page load
  useEffect(() => {
    const savedWallet = localStorage.getItem('walletState');
    if (savedWallet) {
      const { walletType, network, publicKey } = JSON.parse(savedWallet);
      if (walletType === 'phantom' && publicKey) {
        setNetwork(network);
        setPublicKey(publicKey);
        const phantom = new PhantomWalletAdapter();
        phantom.connect().then(() => {
          setWallet(phantom);
        });
      }
    }
  }, []);

  return (
    <WalletContext.Provider value={{
      wallet,
      publicKey,
      network,
      connection,
      connectWallet,
      disconnectWallet
    }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
};