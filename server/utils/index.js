import crypto from 'crypto';

const algorithm = 'aes-256-ctr';
const password = process.env.SPOTIFY_CLIENT_SECRET;

export function encrypt(input) {
  const cipher = crypto.createCipher(algorithm, password);
  let encrypted = cipher.update(input, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

export function decrypt(input) {
  const decipher = crypto.createDecipher(algorithm, password);
  let decrypted = decipher.update(input, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
