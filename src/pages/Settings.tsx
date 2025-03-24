import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowLeft, Lock, Moon, Sun, ShieldCheck, ToggleLeft, ToggleRight, 
  Bell, CreditCard, User, LogOut, Globe, Clipboard 
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import { Connection, PublicKey, Transaction, SystemProgram } from "@solana/web3.js";

const Settings = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const darkMode = theme === "dark";
  

  const [twoFA, setTwoFA] = useState(false);
  const [network, setNetwork] = useState("Devnet");
  const [wallet, setWallet] = useState(null);

  const handleCreateWallet = async () => {
    try {
      const response = await fetch("http://localhost:5000/create-wallet");
      const data = await response.json();
      setWallet(data);
      localStorage.setItem("wallet", JSON.stringify(data));
    } catch (error) {
      console.error("Error creating wallet:", error);
    }
  };

  useEffect(() => {
    const storedWallet = JSON.parse(localStorage.getItem("wallet"));
    if (storedWallet) {
      setWallet(storedWallet);
    }
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-900"} p-6`}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate("/dashboard")}>
          <ArrowLeft size={30} className="text-gray-600" />
        </button>
        <h1 className="text-2xl font-semibold">Settings</h1>
      </div>

      {/* Dark Mode Toggle */}
      <br/><br/>
      <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
        <span className="text-lg flex items-center gap-2">
          {darkMode ? <Moon size={22} /> : <Sun size={22} />} Dark Mode
        </span>
        <button onClick={toggleTheme}>

          {darkMode ? <ToggleRight size={30} className="text-teal-500" /> : <ToggleLeft size={30} className="text-gray-500" />}
        </button>
      </div>

      {/* Network Status */}
      <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
        <span className="text-lg flex items-center gap-2">
          <Globe size={22} /> Network Status:<span style={{color:"green", fontStyle: "Bold"}} > {network}</span>
        </span>
      </div>

      {/* Wallet Section */}
      {wallet ? (
        <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
          <h2 className="text-lg font-semibold">Wallet Address</h2>
          <div className="flex justify-between items-center mt-2">
            <span className="truncate">{wallet.publicKey}</span>
            <button
              onClick={() => navigator.clipboard.writeText(wallet.publicKey)}
              
              className="text-teal-500"
            >
              <Clipboard size={20} />
            </button>
          </div>
        </div>
      ) : (
        <button 
          onClick={handleCreateWallet} 
          className="p-3 bg-teal-500 text-white rounded-lg"
        >
          Create Wallet
        </button>
      )}

      {/* Security & Account Settings */}
      <div className="space-y-4">
        <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <span className="text-lg flex items-center gap-2"><Bell size={22} /> Notifications</span>
          <button className="text-teal-500">Manage</button>
        </div>
{/* 
        <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <span className="text-lg flex items-center gap-2"><CreditCard size={22} /> Payment Methods</span>
          <button className="text-teal-500">Edit</button>
        </div> */}

        <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <span className="text-lg flex items-center gap-2"><User size={22} /> Profile Settings</span>
          <button className="text-teal-500">Update</button>
        </div>

        <div className="flex justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <span className="text-lg flex items-center gap-2"><Lock size={22} /> Two-Factor Authentication (2FA)</span>
          <button onClick={() => setTwoFA(!twoFA)}>
            {twoFA ? <ToggleRight size={30} className="text-teal-500" /> : <ToggleLeft size={30} className="text-gray-500" />}
          </button>
        </div>
      </div>

      {/* Security Section */}
      <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-4">
        <h2 className="text-xl font-semibold flex items-center gap-2 mb-3">
          <ShieldCheck size={24} className="text-teal-500" /> Security
        </h2>
        <ul className="space-y-3">
          <li className="text-gray-700 dark:text-gray-300">✔ Secure PIN & Password</li>
          <li className="text-gray-700 dark:text-gray-300">✔ Biometric Authentication</li>
          <li className="text-gray-700 dark:text-gray-300">✔ Encrypted Private Keys</li>
          <li className="text-gray-700 dark:text-gray-300">✔ Auto Logout after inactivity</li>
        </ul>
      </div>

      {/* Logout */}
      <div className="flex justify-between items-center p-4 bg-red-100 dark:bg-red-800 rounded-lg">
        <span className="text-lg flex items-center gap-2 text-red-600 dark:text-red-300">
          <LogOut size={25} /> Log Out
        </span>
        <a href="/login"> <button className="text-red-600 dark:text-red-300">Sign Out</button></a>
      </div>
    </div>
  );
};

export default Settings;
