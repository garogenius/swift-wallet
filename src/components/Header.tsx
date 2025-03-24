import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Scan } from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();

  return (
    <div className="p-4 border-b border-gray-100 bg-white">
      <div className="flex items-center justify-between">
        {/* Settings Button */}
        <button 
          onClick={() => navigate('/settings')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Settings size={35} className="text-gray-600" />
        </button>

        {/* App Title */}
        <h1 className="text-xl font-semibold text-gray-800">Swift Wallet</h1>

        {/* Scan QR Button */}
        <button
          onClick={() => navigate('/scan')}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <Scan size={35} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default Header;