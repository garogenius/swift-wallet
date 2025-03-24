import React from 'react';

interface TokenIconProps {
  symbol: string;
  logoURI?: string;
  size?: number;
  className?: string;
}

const TokenIcon: React.FC<TokenIconProps> = ({ 
  symbol, 
  logoURI, 
  size = 24, 
  className = '' 
}) => {
  const getTokenImage = (symbol: string): string => {
    const normalizedSymbol = symbol.toUpperCase();
    const jupiterCDN = 'https://cdn.jup.ag/tokens';
    
    const tokenMap: Record<string, string> = {
      'SOL': `${jupiterCDN}/solana.svg`,
      'USDC': `${jupiterCDN}/usdc.svg`,
      'USDT': `${jupiterCDN}/usdt.svg`,
      'BONK': `${jupiterCDN}/bonk.svg`,
      'JUP': `${jupiterCDN}/jup.svg`,
      'WSOL': `${jupiterCDN}/solana.svg`,
      'UNKNOWN': 'https://cdn.jsdelivr.net/gh/trustwallet/assets/blockchains/solana/info/logo.png'
    };

    return tokenMap[normalizedSymbol] || `${jupiterCDN}/${normalizedSymbol}.svg`;
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>): void => {
    const img = e.currentTarget;
    if (!img.src.includes('cdn.jup.ag')) {
      img.src = getTokenImage(symbol);
    } else {
      img.src = 'https://cdn.jsdelivr.net/gh/trustwallet/assets/blockchains/solana/info/logo.png';
      img.onerror = null;
    }
  };

  const imageSrc = logoURI || getTokenImage(symbol);

  return (
    <img
      src={imageSrc}
      alt={`${symbol} icon`}
      className={`rounded-full ${className}`}
      style={{ 
        width: size,
        height: size,
        minWidth: size,
        minHeight: size,
        objectFit: 'contain'
      }}
      onError={handleError}
      loading="lazy"
    />
  );
};

export default TokenIcon;