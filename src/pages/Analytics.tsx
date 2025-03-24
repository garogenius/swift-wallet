import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../context/ThemeContext';
import Header from '../components/Header';
import Navigation from '../components/Navigation';

const data = [
  { name: 'Jan', value: 4000 },
  { name: 'Feb', value: 3000 },
  { name: 'Mar', value: 2000 },
  { name: 'Apr', value: 2780 },
  { name: 'May', value: 1890 },
  { name: 'Jun', value: 2390 },
];

const Analytics = () => {
  const { theme } = useTheme();

  return (
    
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
     <Header publicKey="TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA" />

      <div className="p-6">
        <br/><br/>
        <h1 className="text-2xl font-bold mb-8">Portfolio Analytics</h1>
        
        <div className={`p-4 rounded-xl mb-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <h2 className="text-lg font-semibold mb-4">Portfolio Performance</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#14b8a6" 
                  fill="#14b8a6" 
                  fillOpacity={0.3} 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`grid grid-cols-2 gap-4 mb-6`}>
          <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <h3 className="text-sm font-medium mb-2">Total Value</h3>
            <p className="text-2xl font-bold">$12,345.67</p>
            <span className="text-green-500">+15.4%</span>
          </div>
          <div className={`p-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
            <h3 className="text-sm font-medium mb-2">24h Change</h3>
            <p className="text-2xl font-bold">+$1,234.56</p>
            <span className="text-green-500">+5.2%</span>
          </div>
        </div>
      </div>
      <Navigation />
    </div>
    
  );
};

export default Analytics;