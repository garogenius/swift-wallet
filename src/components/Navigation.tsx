import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Wallet, BarChart2, Compass, Apple as Apps, Gamepad, EarIcon, ThermometerSnowflake, LucideMartini, Gamepad2Icon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useTheme();

  const navItems = [
    { path: '/dashboard', icon: Wallet, label: 'Wallet' },
    { path: '/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/market', icon: Compass, label: 'Market' },
    { path: '/games', icon: Gamepad2Icon, label: 'Games' },
    { path: '/apps', icon: Apps, label: 'Apps' }
  ];

  return (
    <div className={`fixed bottom-0 left-0 right-0 ${
      theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
    } border-t p-5`}>
      <div className="flex justify-between">
        {navItems.map((item) => (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`${
              location.pathname === item.path
                ? 'text-teal-500'
                : theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            }`}
          >
            <item.icon size={35} />
          </button>
        ))}
      </div>
    </div>
  );
};

export default Navigation;