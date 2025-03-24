import { Connection, PublicKey } from '@solana/web3.js';

const RPC_ENDPOINT = process.env.RPC_URL || 'https://api.mainnet-beta.solana.com';
const connection = new Connection(RPC_ENDPOINT);

export const getTokenBalances = async (walletAddress: string) => {
  try {
    const publicKey = new PublicKey(walletAddress);
    
    // 1. Get SOL balance
    const solBalance = await connection.getBalance(publicKey);
    const solAmount = solBalance / 10**9;

    // 2. Get SPL token accounts
    const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
      programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
    });

    // 3. Basic token list - always include SOL
    const tokens = [{
      mint: 'So11111111111111111111111111111111111111112',
      symbol: 'SOL',
      name: 'Solana',
      amount: solAmount,
      decimals: 9,
      logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png'
    }];

    // 4. Process SPL tokens
    tokenAccounts.value.forEach(account => {
      const info = account.account.data.parsed.info;
      const amount = Number(info.tokenAmount.uiAmount);
      
      if (amount > 0) {
        tokens.push({
          mint: info.mint,
          symbol: info.tokenAmount.tokenSymbol || 'UNKNOWN',
          name: info.tokenAmount.tokenName || 'Unknown Token',
          amount: amount,
          decimals: info.tokenAmount.decimals,
          logoURI: undefined
        });
      }
    });

    return { tokens };
  } catch (error) {
    console.error('Error in getTokenBalances:', error);
    throw new Error('Failed to fetch token balances');
  }
};