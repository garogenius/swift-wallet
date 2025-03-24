const { Connection, Keypair, PublicKey, LAMPORTS_PER_SOL } = require('@solana/web3.js');
const { Buffer } = require('buffer');
const crypto = require('crypto');

const connection = new Connection(process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com', 'confirmed');

let wallets = {}; // Temporary storage (Use DB for production)

// Generate random mnemonic phrase (12 words)
const generatePhrase = () => {
    const words = [
        "apple", "banana", "cherry", "dragon", "eagle", "falcon", "grape", "hammer", "ice", "jungle",
        "kite", "lemon", "mango", "notebook", "orange", "piano", "queen", "rocket", "sun", "tiger",
        "umbrella", "violet", "whale", "xylophone", "yellow", "zebra"
    ];
    
    return Array.from({ length: 12 }, () => words[Math.floor(Math.random() * words.length)]);
};

// Step 1: Create wallet with PIN & generate key phrase
const createWalletStep1 = (pin) => {
    if (!pin || pin.length < 4) {
        throw new Error('PIN must be at least 4 digits.');
    }

    const keypair = Keypair.generate();
    const publicKey = keypair.publicKey.toString();
    const privateKey = Buffer.from(keypair.secretKey).toString('hex');
    const keyPhrase = generatePhrase();

    // Store temporarily
    wallets[publicKey] = { pin, keyPhrase, privateKey };

    return { publicKey, keyPhrase };
};

// Step 2: Verify user-entered phrases before completing wallet creation
const createWalletStep2 = (publicKey, enteredPhrases, positions) => {
    if (!wallets[publicKey]) {
        throw new Error('Wallet session expired.');
    }

    const originalPhrase = wallets[publicKey].keyPhrase;
    const correctPhrases = positions.map(pos => originalPhrase[pos - 1]);

    if (JSON.stringify(correctPhrases) !== JSON.stringify(enteredPhrases)) {
        throw new Error('Phrase verification failed.');
    }

    return { success: true, message: 'Wallet successfully created!', publicKey };
};

// Get SOL balance
const getBalance = async (publicKey) => {
    try {
        const balance = await connection.getBalance(new PublicKey(publicKey));
        return balance / LAMPORTS_PER_SOL;
    } catch (error) {
        console.error('Error fetching balance:', error);
        throw new Error('Error fetching balance');
    }
};

// Get token accounts
const getTokenAccounts = async (publicKey) => {
    try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            new PublicKey(publicKey),
            { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
        );

        if (!tokenAccounts.value || tokenAccounts.value.length === 0) {
            console.warn('No token accounts found.');
            return [];
        }

        return tokenAccounts.value.map(account => {
            const info = account.account.data.parsed.info;
            return {
                mint: info.mint,
                amount: Number(info.tokenAmount.amount) / 10 ** info.tokenAmount.decimals,
                decimals: info.tokenAmount.decimals
            };
        });
    } catch (error) {
        console.error('Error fetching token accounts:', error);
        throw new Error('Failed to fetch token accounts: ' + error.message);
    }
};

module.exports = { createWalletStep1, createWalletStep2, getBalance, getTokenAccounts };
