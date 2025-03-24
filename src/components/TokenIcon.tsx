import React from 'react';

interface TokenIconProps {
  symbol: string;
  size?: number;
  className?: string;
}

const TokenIcon: React.FC<TokenIconProps> = ({ symbol, size = 24, className = '' }) => {
  const getTokenImage = (symbol: string) => {
    const normalizedSymbol = symbol.toUpperCase();
    const jupiterCDN = 'https://cdn.jup.ag/tokens';
    
    // Special cases for devnet tokens
    const tokenMap: { [key: string]: string } = {
      'SOL': `${jupiterCDN}/solana.svg`,
      'USDC': `${jupiterCDN}/usdc.svg`,
      'USDT': `${jupiterCDN}/usdt.svg`,
      'UNKWN': 'https://cdn.jsdelivr.net/gh/trustwallet/assets/blockchains/solana/info/logo.png'
    };

    return tokenMap[normalizedSymbol] || `${jupiterCDN}/${normalizedSymbol}.svg`;
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = 'https://cdn.jsdelivr.net/gh/trustwallet/assets/blockchains/solana/info/logo.png';
    e.currentTarget.onerror = null; // Prevent infinite loop
  };

  return (
    <img
      src={getTokenImage(symbol)}
      alt={`${symbol} icon`}
      className={`rounded-full ${className}`}
      style={{ 
        width: size,
        height: size,
        minWidth: size,
        minHeight: size 
      }}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default TokenIcon;