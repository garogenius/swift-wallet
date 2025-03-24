import * as bip39 from 'bip39';

// Set the default wordlist to English
bip39.setDefaultWordlist('english');

// Function to encrypt data using AES-256 (Web Crypto API)
export const encryptData = async (data: string, secret: string): Promise<string> => {
  try {
    // Convert the secret to a CryptoKey
    const encoder = new TextEncoder();
    const keyMaterial = await window.crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'PBKDF2' },
      false,
      ['deriveKey']
    );

    // Derive a 256-bit key using PBKDF2
    const key = await window.crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('secure-salt'), // Use a fixed or random salt
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
    );

    // Generate a random initialization vector (IV)
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    // Encrypt the data
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(data)
    );

    // Combine IV and encrypted data into a single string
    return `${bufferToHex(iv)}:${bufferToHex(new Uint8Array(encrypted))}`;
  } catch (error) {
    console.error('Error encrypting data:', error);
    throw new Error('Encryption failed');
  }
};

// Helper function to convert ArrayBuffer to hex string
const bufferToHex = (buffer: ArrayBuffer | Uint8Array): string => {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
};

// Function to generate a secure 24-word BIP39 mnemonic phrase
export const generateSecurePhrase = (): string[] => {
  try {
    // Generate a 24-word mnemonic with 256 bits of entropy
    const mnemonic = bip39.generateMnemonic(256);
    return mnemonic.split(' '); // Split the phrase into an array of words
  } catch (error) {
    console.error('Error generating secure phrase:', error);
    throw new Error('Phrase generation failed');
  }
};