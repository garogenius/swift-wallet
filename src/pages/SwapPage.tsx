import React, { useState } from "react";
import { useWallet } from "../context/WalletContext";
import axios from "axios";

const SwapPage: React.FC = () => {
  const { wallet, publicKey, network } = useWallet();
  const [amount, setAmount] = useState("");

  const handleSwap = async () => {
    if (!wallet || !publicKey) {
      alert("Connect your wallet first!");
      return;
    }

    try {
      const response = await axios.get("https://quote-api.jup.ag/v4/quote", {
        params: {
          inputMint: network === "solana" ? "So11111111111111111111111111111111111111112" : "ETH",
          outputMint: "USDC",
          amount: Number(amount) * 1_000_000_000,
          slippage: 0.5,
        },
      });

      const transaction = response.data.transactions;
      await wallet.signTransaction(transaction);
      await wallet.sendTransaction(transaction);
      alert("Swap Successful!");
    } catch (error) {
      console.error(error);
      alert("Swap Failed.");
    }
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-white p-6">
      <h1 className="text-3xl font-bold">Swap {network.toUpperCase()} to USDC</h1>
      <input
        type="number"
        placeholder="Amount"
        className="border p-2 rounded w-full max-w-sm mt-4"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleSwap} className="bg-green-500 text-white p-3 rounded mt-4">Swap</button>
    </div>
  );
};

export default SwapPage;
