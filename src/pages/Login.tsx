import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock } from 'lucide-react';

const PinUnlock = () => {
  const navigate = useNavigate();
  const [pin, setPin] = useState<string[]>(['', '', '', '']);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleDigitInput = (index: number, value: string) => {
    if (/^\d$/.test(value)) {
      const newPin = [...pin];
      newPin[index] = value;
      setPin(newPin);

      if (index < 3 && value) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !pin[index] && index > 0) {
      const newPin = [...pin];
      newPin[index - 1] = '';
      setPin(newPin);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add your PIN verification logic here
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="absolute top-0 left-0 w-full h-60 bg-gradient-to-br from-teal-400 to-teal-600 rounded-bl-[80px]">
        <div className="flex flex-col items-center justify-center h-full">
          <Lock className="text-white mb-4" size={40} />
          <h1 className="text-white text-2xl font-medium">Enter Your PIN</h1>
        </div>
      </div>

      <div className="relative pt-40 px-6">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-center space-x-4">
            {pin.map((digit, index) => (
              <input
                key={index}
                type="password"
                maxLength={1}
                value={digit}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleDigitInput(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-16 h-16 text-3xl text-center border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            ))}
          </div>

          <button
            type="submit"
            className="w-full bg-teal-500 text-white py-4 rounded-lg font-medium hover:bg-teal-600 transition-colors"
          >
            Unlock Wallet
          </button>
        </form>

        <p className="text-center mt-6 text-gray-600">
          Forgot PIN?{' '}
          <Link to="/recover" className="text-teal-500 font-medium">
            Recover Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default PinUnlock;