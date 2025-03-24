const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { SALT, ENCRYPTION_KEY } = process.env;

const IV_LENGTH = 16;

exports.hashPin = (pin) => {
  return bcrypt.hash(pin + SALT, 10);
};

exports.encrypt = (text, pinHash) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    'aes-256-cbc', 
    Buffer.from(ENCRYPTION_KEY), 
    iv
  );
  
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString('hex') + ':' + encrypted.toString('hex');
};

exports.decrypt = (text, pinHash) => {
  const [iv, encrypted] = text.split(':');
  const decipher = crypto.createDecipheriv(
    'aes-256-cbc', 
    Buffer.from(ENCRYPTION_KEY), 
    Buffer.from(iv, 'hex')
  );
  
  let decrypted = decipher.update(Buffer.from(encrypted, 'hex'));
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
};