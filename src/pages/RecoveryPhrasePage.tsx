// src/components/RecoveryPhrasePage.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Clipboard } from 'lucide-react';

const RecoveryPhrasePage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { securityPhrase } = location.state || { securityPhrase: [] }; // Access securityPhrase from state
  const [isCopied, setIsCopied] = useState(false); // State to manage button text

  const copyPhrase = async () => {
    try {
      await navigator.clipboard.writeText(securityPhrase.join(' '));
      setIsCopied(true); // Set button text to "Copied"
      setTimeout(() => setIsCopied(false), 4000); // Revert to "Copy Phrase" after 4 seconds
    } catch (err) {
      alert('Clipboard access denied. Please copy manually.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col overflow-hidden"> {/* Disable scrolling */}
      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6"> {/* Center content vertically and horizontally */}
        <div className="max-w-md w-full space-y-6">
          {/* Warning Message */}
          <div className="p-3 bg-red-100 text-red-700 rounded-lg text-center">
            <strong>Do not share your Secret Phrases!</strong><br />
            If someone has your secret phrase, they will have full control of your wallet.
          </div>

          {/* Recovery Phrase Section */}
          <h2 className="text-lg font-bold text-gray-800 text-center">Your Security Phrase</h2>
          <div className="p-4 bg-gray-100 border border-gray-300 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              {securityPhrase.map((word, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-2 bg-white rounded-lg shadow-sm border border-gray-200" // Add shadow and border
                >
                  <span className="text-gray-600">{index + 1}.</span>
                  <span className="font-medium">{word}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Copy Phrase Button */}
          <button
            onClick={copyPhrase}
            className="w-full p-3 bg-teal-500 text-white rounded-lg flex items-center justify-center space-x-2 hover:bg-teal-600"
          >
            <Clipboard size={20} />
            <span>{isCopied ? 'Copied' : 'Copy Phrase'}</span> {/* Dynamic button text */}
          </button>

          {/* Continue to Dashboard Button */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecoveryPhrasePage;