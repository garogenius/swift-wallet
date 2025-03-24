import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Copy } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useTheme } from '../context/ThemeContext';

const ReceivePage: React.FC = () => {
    const { publicKey } = useParams();
    const [qrCode, setQrCode] = useState<string | null>(null);
    const navigate = useNavigate();
    const { theme } = useTheme();
    const darkMode = theme === "dark";

    useEffect(() => {
        if (publicKey) {
            axios.get(`http://localhost:5000/receive/${publicKey}`)
                .then((response) => {
                    setQrCode(response.data.qrCode);
                })
                .catch((error) => {
                    console.error('Error fetching QR code:', error);
                });
        }
    }, [publicKey]);

    const copyToClipboard = () => {
        if (publicKey) {
            navigator.clipboard.writeText(publicKey);
            alert('Wallet address copied!');
        }
    };

    return (
        <div className="h-screen flex flex-col items-center justify-center bg-white p-6">
             <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} p-6`}>      
      {/* Header */}
      <div className="absolute top-6 left-6 flex items-center gap-4">
        <button onClick={() => navigate("/dashboard")} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700">
          <ArrowLeft size={30} className="text-gray-600 dark:text-white" />
        </button>
        <h1 className="text-3xl font-semibold">Receive</h1>
      </div>
            <h2 className="text-2xl font-bold mb-4">Receive Funds</h2>

            {qrCode ? (
                <img src={qrCode} alt="QR Code" className="w-80 h-80 border p-2 rounded-lg" />
            ) : (
                <p className="text-gray-600">Loading QR code...</p>
            )}

            <div className="mt-4 flex items-center bg-gray-100 p-2 rounded-lg w-full max-w-sm justify-between">
                <span className="text-gray-800 truncate">{publicKey}</span>
                <button onClick={copyToClipboard} className="p-2 bg-gray-200 rounded-md">
                    <Copy size={20} className="text-gray-600" />
                </button>
            </div>
        </div>
        </div>
    );
};

export default ReceivePage;
