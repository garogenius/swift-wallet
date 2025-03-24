require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { 
    Connection, 
    PublicKey, 
    Keypair, 
    LAMPORTS_PER_SOL 
} = require('@solana/web3.js');

const { getTokenAccounts } = require('./wallet');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const connection = new Connection(SOLANA_RPC_URL, "confirmed");

let wallets = {}; // Store wallets in-memory (Replace with DB for production)

// Create a new wallet with PIN & Security Phrase
app.post('/create-wallet', (req, res) => {
    try {
        const { pin, securityPhrase } = req.body;

        if (!pin || pin.length < 4) {
            return res.status(400).json({ error: 'PIN must be at least 4 digits' });
        }
        if (!securityPhrase || securityPhrase.split(' ').length < 3) {
            return res.status(400).json({ error: 'Security phrase must be at least 3 words' });
        }

        const keypair = Keypair.generate();
        const publicKey = keypair.publicKey.toString();
        const privateKey = Buffer.from(keypair.secretKey).toString('hex');

        wallets[publicKey] = { pin, securityPhrase, privateKey };

        res.json({ publicKey });
    } catch (error) {
        console.error("Error creating wallet:", error);
        res.status(500).json({ error: "Error creating wallet" });
    }
});

// Import wallet with PIN verification
app.post('/import-wallet', (req, res) => {
    try {
        const { privateKey, pin } = req.body;

        if (!privateKey || !pin) {
            return res.status(400).json({ error: 'Private key and PIN are required' });
        }

        const keypair = Keypair.fromSecretKey(Buffer.from(privateKey, 'hex'));
        const publicKey = keypair.publicKey.toString();

        if (!wallets[publicKey] || wallets[publicKey].pin !== pin) {
            return res.status(401).json({ error: 'Invalid PIN or wallet not found' });
        }

        res.json({ publicKey, message: 'Wallet imported successfully' });
    } catch (error) {
        console.error("Error importing wallet:", error);
        res.status(400).json({ error: 'Invalid private key' });
    }
});

// Recover wallet using security phrase
app.post('/recover-wallet', (req, res) => {
    try {
        const { securityPhrase } = req.body;

        const wallet = Object.entries(wallets).find(([_, data]) => data.securityPhrase === securityPhrase);
        if (!wallet) {
            return res.status(404).json({ error: 'Wallet not found' });
        }

        res.json({ publicKey: wallet[0], message: 'Wallet recovered successfully' });
    } catch (error) {
        console.error("Error recovering wallet:", error);
        res.status(500).json({ error: 'Error recovering wallet' });
    }
});

// Fetch balance of a wallet
app.get('/balance/:publicKey', async (req, res) => {
    try {
        const publicKey = new PublicKey(req.params.publicKey);
        const balance = await connection.getBalance(publicKey);
        res.json({ balance: balance / LAMPORTS_PER_SOL });
    } catch (error) {
        console.error("Error fetching balance:", error);
        res.status(400).json({ error: 'Invalid public key' });
    }
});

// Fetch all tokens owned by a wallet
app.get('/tokens/:publicKey', async (req, res) => {
    try {
        const publicKey = new PublicKey(req.params.publicKey);
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(
            publicKey,
            { programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA') }
        );

        const tokens = tokenAccounts.value.map(account => ({
            mint: account.account.data.parsed.info.mint,
            amount: Number(account.account.data.parsed.info.tokenAmount.amount),
            decimals: account.account.data.parsed.info.tokenAmount.decimals
        }));

        res.json({ tokens });
    } catch (error) {
        console.error("Error fetching tokens:", error);
        res.status(500).json({ error: 'Error fetching tokens' });
    }
});

// Fetch live token prices from CoinGecko
app.get('/prices', async (req, res) => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
            params: {
                ids: 'solana,usd-coin,tether',
                vs_currencies: 'usd'
            }
        });

        res.json({
            SOL: response.data.solana?.usd || 0,
            USDC: response.data['usd-coin']?.usd || 0,
            USDT: response.data.tether?.usd || 0
        });
    } catch (error) {
        console.error('CoinGecko API Error:', error);
        res.status(500).json({ error: 'Failed to fetch prices' });
    }
});


// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
