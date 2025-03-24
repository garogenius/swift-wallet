import React, { createContext, useContext, useState } from "react";
import { ethers } from "ethers";

const EthereumContext = createContext<any>(null);

export const EthereumProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ethProvider, setEthProvider] = useState<ethers.providers.Web3Provider | null>(null);
  const [ethAddress, setEthAddress] = useState<string | null>(null);

  const connectEthereum = async () => {
    if (!window.ethereum) return alert("Install Metamask!");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    setEthProvider(provider);
    setEthAddress(await signer.getAddress());
  };

  return (
    <EthereumContext.Provider value={{ ethProvider, ethAddress, connectEthereum }}>
      {children}
    </EthereumContext.Provider>
  );
};

export const useEthereum = () => useContext(EthereumContext);
