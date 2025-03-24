import { ArrowLeft } from 'lucide-react';
import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';

const Games = () => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const darkMode = theme === "dark";

  return (
    <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} p-6`}>      
      {/* Header */}
      <div className="absolute top-6 left-6 flex items-center gap-4">
        <button onClick={() => navigate("/dashboard")} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700">
          <ArrowLeft size={30} className="text-gray-600 dark:text-white" />
        </button>
        <h1 className="text-3xl font-semibold">Games</h1>
      </div>

      {/* Coming Soon Message */}
      <div className="text-center">
        <h2 className="text-4xl font-bold mb-4">Coming Soon...</h2>
        <p className="text-lg text-gray-500 dark:text-gray-400">Stay tuned for exciting games!</p>
      </div>
      <Navigation />
    </div>
  );
};

export default Games;