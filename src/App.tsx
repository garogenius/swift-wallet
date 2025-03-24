import React from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';
import Analytics from './pages/Analytics';
import Market from './pages/Market';
import Apps from './pages/Apps';
import Settings from './pages/Settings';
import QrScanner from './pages/QrScanner';
import Games from './pages/Games';
import ReceivePage from './pages/ReceivePage';

import SwapPage from './pages/SwapPage';
import NotFoundPage from './pages/NotFoundPage.tsx'; 

import SendPage from './pages/SendPage'; 
import RecoveryPhrasePage from './pages/RecoveryPhrasePage.tsx';
import SelectTokenPage from './pages/SelectTokenPage.tsx';
import RecipientAddressPage from './pages/RecipientAddressPage.tsx';
import { WalletProvider } from './context/WalletContext.tsx';
import Auth from './pages/Auth.tsx';

const router = createBrowserRouter([
    { path: "/", element: <Welcome /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },
    { path: "/dashboard", element: <Dashboard /> },
    { path: "/analytics", element: <Analytics /> },
    { path: "/market", element: <Market /> },
    { path: "/apps", element: <Apps /> },
    { path: "/settings", element: <Settings /> },
    { path: "/games", element: <Games /> },
    { path: "/receive/:publicKey", element: <ReceivePage /> }, 
    { path: "/send", element: <SelectTokenPage /> }, 
    { path: "/swap", element: <SwapPage /> },
    { path: "/scan", element: <QrScanner /> },
    { path: "/recovery-phrase", element: <RecoveryPhrasePage /> },
    { path: "/send/:token", element: <RecipientAddressPage /> },
    { path: "/auth", element: <Auth /> },
    { path: "/notfound", element: <NotFoundPage /> },
]);

function App() {
  return (
    <ThemeProvider>
      <WalletProvider>
      <RouterProvider router={router} />
      </WalletProvider>
    </ThemeProvider>
  );
}

export default App;
