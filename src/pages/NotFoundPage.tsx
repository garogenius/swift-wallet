import { ArrowLeft } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";
// import logo from "../assets/logo.png"; 
import { useNavigate } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { useTheme } from '../context/ThemeContext';
const NotFound = () => {
    const navigate = useNavigate();
    const { theme } = useTheme();
    const darkMode = theme === "dark";
  return (

    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
         <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"} p-6`}>      
      {/* Header */}
      <div className="absolute top-6 left-6 flex items-center gap-4">
        <button onClick={() => navigate("/dashboard")} className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700">
          <ArrowLeft size={30} className="text-gray-600 dark:text-white" />
        </button>
        <h1 className="text-3xl font-semibold">Games</h1>
      </div>

      {/* <img src={logo} alt="Logo" className="w-32 h-32 mb-6" /> */}

      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-lg text-gray-400 mt-2">
        Oops! The page you're looking for doesn't exist.
      </p>

      <Link to="/" className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
        Go Back to Home
      </Link>
    </div>
    </div>
  );
};

export default NotFound;
