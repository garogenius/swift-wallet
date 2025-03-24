// types/tokens.ts
export interface Token {
    mint: string;
    symbol: string;
    name: string;
    amount: number;
    value: number;
    decimals: number;
    logoURI?: string;
  }
  
  export interface JupiterToken {
    address: string;
    symbol: string;
    name: string;
    decimals: number;
    logoURI?: string;
    // Add other fields from Jupiter API if needed
  }