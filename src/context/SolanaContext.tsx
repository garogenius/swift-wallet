import React, { createContext, useContext, useEffect, useState } from "react";
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import Wallet from "@project-serum/sol-wallet-adapter";

const SolanaContext = createContext<any>(null);

export const SolanaProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState<PublicKey | null>(null);
  const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

  useEffect(() => {
    const walletInstance = new Wallet("https://www.sollet.io", clusterApiUrl("devnet"));
    setWallet(walletInstance);

    walletInstance.on("connect", (publicKey: PublicKey) => {
      console.log("Wallet connected:", publicKey.toString());
      setConnected(true);
      setPublicKey(publicKey);
    });

    walletInstance.on("disconnect", () => {
      console.log("Wallet disconnected");
      setConnected(false);
      setPublicKey(null);
    });

    return () => walletInstance.disconnect();
  }, []);

  return (
    <SolanaContext.Provider value={{ wallet, connected, publicKey, connection }}>
      {children}
    </SolanaContext.Provider>
  );
};

export const useSolana = () => useContext(SolanaContext);
