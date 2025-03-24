require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const rateLimit = require('express-rate-limit');
const QRCode = require('qrcode');
const {
    Connection,
    PublicKey,
    Keypair,
    LAMPORTS_PER_SOL,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
} = require('@solana/web3.js');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const SOLANA_RPC_URL = process.env.SOLANA_RPC_URL || 'https://api.devnet.solana.com';
const PORT = process.env.PORT || 5000;
const connection = new Connection(SOLANA_RPC_URL, 'confirmed');

// Rate limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
});
app.use(limiter);

// ✅ Create Wallet
app.post('/api/wallet/create', (req, res) => {
    try {
        const { publicKey, encryptedKey, securityPhrase } = req.body;
        if (!publicKey || !encryptedKey || !securityPhrase) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const walletData = { publicKey, encryptedKey, securityPhrase, createdAt: new Date() };
        console.log('Wallet created:', walletData);
        res.status(201).json({ message: 'Wallet created successfully', publicKey });
    } catch (error) {
        console.error('Error creating wallet:', error);
        res.status(500).json({ error: 'Failed to create wallet' });
    }
});

// ✅ Import Wallet
app.post('/api/wallet/import', (req, res) => {
    try {
        const { privateKey, pin } = req.body;
        if (!privateKey || !pin) {
            return res.status(400).json({ error: 'Private key and PIN are required' });
        }
        const keypair = Keypair.fromSecretKey(Buffer.from(privateKey, 'hex'));
        res.json({ publicKey: keypair.publicKey.toString(), message: 'Wallet imported successfully' });
    } catch (error) {
        console.error('Error importing wallet:', error);
        res.status(400).json({ error: 'Invalid private key' });
    }
});

// ✅ Get Wallet Balance
app.get('/api/wallet/balance/:publicKey', async (req, res) => {
    try {
        const balance = await connection.getBalance(new PublicKey(req.params.publicKey));
        res.status(200).json({ balance });
    } catch (err) {
        console.error('Error fetching balance:', err);
        res.status(500).json({ error: 'Failed to fetch balance' });
    }
});

// ✅ Fetch Token Prices
app.get('/api/wallet/prices', async (req, res) => {
    try {
        const response = await axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest', {
            headers: {
                'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
            },
            params: {
                symbol: 'SOL,USDC,USDT',
            },
        });
        res.json({
            SOL: response.data.data.SOL.quote.USD.price,
            USDC: response.data.data.USDC.quote.USD.price,
            USDT: response.data.data.USDT.quote.USD.price,
        });
    } catch (error) {
        console.error('CoinMarketCap API Error:', error);
        res.status(500).json({ error: 'Failed to fetch prices' });
    }
});

// ✅ Send SOL
app.post('/api/wallet/send', async (req, res) => {
    try {
        const { fromPrivateKey, toPublicKey, amount } = req.body;
        if (!fromPrivateKey || !toPublicKey || !amount) {
            return res.status(400).json({ error: 'All fields are required' });
        }
        const senderKeypair = Keypair.fromSecretKey(Buffer.from(fromPrivateKey, 'hex'));
        const transaction = new Transaction().add(
            SystemProgram.transfer({
                fromPubkey: senderKeypair.publicKey,
                toPubkey: new PublicKey(toPublicKey),
                lamports: amount * LAMPORTS_PER_SOL,
            })
        );
        const signature = await sendAndConfirmTransaction(connection, transaction, [senderKeypair]);
        res.json({ message: 'Transaction successful', signature });
    } catch (error) {
        console.error('Error sending SOL:', error);
        res.status(500).json({ error: 'Transaction failed' });
    }
});

// ✅ Fetch Tokens for a Wallet
const fetchWalletData = async (walletPublicKey) => {
    try {
        const publicKey = new PublicKey(walletPublicKey);
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(publicKey, {
            programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'),
        });

        const tokens = tokenAccounts.value.map((account) => {
            const tokenInfo = account.account.data.parsed.info;
            return {
                mint: tokenInfo.mint,
                owner: tokenInfo.owner,
                amount: tokenInfo.tokenAmount.uiAmount,
            };
        });

        return tokens;
    } catch (error) {
        console.error('Error fetching tokens from Solana:', error);
        throw error;
    }
};

app.get('/api/wallet/tokens/:walletPublicKey', async (req, res) => {
    try {
        const { walletPublicKey } = req.params;

        // Fetch tokens associated with the wallet
        const tokens = await fetchWalletData(walletPublicKey);

        if (tokens.length > 0) {
            res.status(200).json({ tokens });
        } else {
            res.status(404).json({ error: 'No tokens found for this wallet' });
        }
    } catch (error) {
        console.error('Error fetching tokens:', error);
        res.status(500).json({ error: 'Failed to fetch tokens' });
    }
});

// ✅ Generate QR Code for Payments
app.get('/receive/:publicKey', async (req, res) => {
    try {
        const qrCodeData = await QRCode.toDataURL(req.params.publicKey);
        res.json({ qrCode: qrCodeData });
    } catch (error) {
        console.error('Error generating QR Code:', error);
        res.status(500).json({ error: 'Failed to generate QR Code' });
    }
});

// ✅ Start Server
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));