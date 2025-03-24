import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Mail, ArrowRight } from 'lucide-react';

const Welcome = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
 
    {
      title: "Welcome to Swift Wallet!",
      subtitle: "",
      description: "A next-gen digital wallet built on Solana & Sonic for ultra-fast, secure, and low-cost transactions.",
      image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&q=80&w=500"
    },
    {
      title: "Powered by Solana & Sonic",
      subtitle: "Blazing-Fast & Scalable",
      description: "Experience lightning-fast transactions with the power of Solana's blockchain and Sonic's seamless integration.",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=500"
    },
    {
      title: "Stay in Control",
      subtitle: "Track & Manage",
      description: "Monitor your transactions in real-time, receive instant notifications, and stay in control of your funds.",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=500"
    },
    {
      title: "Business & Personal Accounts",
      subtitle: "For Everyone!!",
      description: "Create personal or business accounts and enjoy seamless financial management on a decentralized network.",
      image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&q=80&w=500"
    },
    {
      title: "Secure & Efficient Transactions",
      subtitle: "Low Fees, High Security",
      description: "Send, receive, and manage your digital assets with near-zero fees and top-tier security.",
      image: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&q=80&w=500"
    },
    {
      title: "Swift Wallet",
      subtitle: "Sign up now and unlock the full potential of SwiftWallet powered by Solana & Sonic.",
      description: "",
      image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=500",
      showSignUpButtons: true
    }
  ];

  const handleNext = () => {
    if (currentSlide === slides.length - 1) {
      navigate('/login');
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <div className="flex-1 p-6 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center text-center relative">
          {currentSlide > 0 && (
            <button
              onClick={handlePrev}
              className="absolute left-0 top-3 transform -translate-y-1/2 p-2 bg-gray-100 rounded-full"
            >
              <ArrowRight size={27} className="transform rotate-180" />
            </button>
          )}
          
          <h1 className="text-4xl font-bold mb-2">{slides[currentSlide].title}</h1>
          {slides[currentSlide].subtitle && (
            <h2 className="text-xl mb-4">{slides[currentSlide].subtitle}</h2>
          )}
          <p className="text-gray-600 mb-8">{slides[currentSlide].description}</p>
          
          {slides[currentSlide].showSignUpButtons ? (
            <div className="w-full space-y-4">
              <button
                onClick={() => navigate('/signup')}
                className="w-full bg-teal-500 text-white py-4 rounded-lg flex items-center justify-center gap-2"
              >
                <Mail size={20} />
                Continue with Mail
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="w-full border-2 border-gray-300 text-gray-700 py-4 rounded-lg"
              >
                Sign As Guest
              </button>
            </div>
          ) : (
            <img 
              src={slides[currentSlide].image} 
              alt="Welcome illustration" 
              className="w-full max-w-md rounded-lg shadow-lg mb-8"
            />
          )}

          {!slides[currentSlide].showSignUpButtons && (
            <button
              onClick={handleNext}
              className="absolute right-0 top-3 transform -translate-y-1/2 p-2 bg-gray-100 rounded-full"
            >
              <ArrowRight size={27} />
            </button>
          )}
        </div>
        
        <div className="flex justify-center items-center gap-2 mb-8">
          {slides.map((_, index) => (
            <div 
              key={index}
              className={`w-3 h-3 rounded-full ${
                index === currentSlide ? 'bg-teal-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>

        {!slides[currentSlide].showSignUpButtons && (
          <button
            onClick={handleNext}
            className="w-full bg-teal-500 text-white py-4 rounded-lg flex items-center justify-center gap-2"
          >
            {currentSlide === slides.length - 1 ? 'Get Started' : 'Next'}
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Welcome;