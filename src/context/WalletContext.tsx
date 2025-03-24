import React, { createContext, useContext, useState, useEffect } from "react";
import { ethers } from "ethers";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { Connection, PublicKey } from "@solana/web3.js";
import Web3 from "web3";
import WalletConnectProvider from "@walletconnect/web3-provider";

interface WalletContextType {
  wallet: any;
  publicKey: string | null;
  network: string;
  connectWallet: (network: string) => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) throw new Error("useWallet must be used within WalletProvider");
  return context;
};

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<any>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [network, setNetwork] = useState<string>("");

  const connectWallet = async (network: string) => {
    try {
      if (network === "solana") {
        const phantom = new PhantomWalletAdapter();
        await phantom.connect();
        const pubKey = phantom.publicKey?.toString();
        setWallet(phantom);
        setPublicKey(pubKey);
        setNetwork("solana");
      } else if (network === "ethereum" || network === "bsc" || network === "polygon") {
        if (window.ethereum) {
          const provider = new ethers.BrowserProvider(window.ethereum);
          const accounts = await provider.send("eth_requestAccounts", []);
          setWallet(provider);
          setPublicKey(accounts[0]);
          setNetwork(network);
        } else {
          throw new Error("Metamask not installed!");
        }
      } else {
        throw new Error("Unsupported network");
      }
    } catch (error) {
      console.error(error);
      alert(error.message);
    }
  };

  const disconnectWallet = () => {
    setWallet(null);
    setPublicKey(null);
    setNetwork("");
  };

  return (
    <WalletContext.Provider value={{ wallet, publicKey, network, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
};
