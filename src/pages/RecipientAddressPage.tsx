import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlineQrcode } from "react-icons/ai"; // QR Code Icon
import { IoArrowBack } from "react-icons/io5"; // Back Arrow Icon
import { ArrowLeft } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const RecipientAddressPage: React.FC = () => {
  const navigate = useNavigate();
  const [address, setAddress] = useState("");
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  return (
    <div className="flex flex-col h-screen px-6 pt-4 text-black"  >
      
    {/* Header */}
    <div className="absolute top-6 left-6 flex items-center gap-4">
      <button onClick={() => navigate("/dashboard")} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700">
        <ArrowLeft size={30} className="text-gray-600 dark:text-white" />
      </button>
      <h1 className="text-3xl font-semibold">Send</h1>
    </div>
   
      {/* Header Section */}
      <div style={{paddingBottom:70}} className="flex items-center">
        <button onClick={() => navigate(-1)} className="text-white text-2xl">
          <IoArrowBack />
        </button>
       
      </div>
      

      {/* Input Field for Wallet Address */}
      <div className="relative mt-4">
        <input
          type="text"
          placeholder="Wallet Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="w-full bg-[#121212] text-white px-6 py-6 rounded-lg focus:outline-none border border-gray-700"
        />
        <button
          onClick={() => navigate("/scan")}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400"
        >
          <AiOutlineQrcode size={35} />
        </button>
      </div>

      {/* Space between input and button */}
      <div className="mt-16"></div>

      {/* Continue Button */}
      <button
        className="w-full py-5 border border-gray-500 text-gray-500 rounded-lg transition duration-300 hover:bg-gray-700 hover:text-white"
      >
        Continue
      </button>
    </div>
  
  );
};

export default RecipientAddressPage;
