import { promises as fs } from 'fs';
import path from 'path';
import { createCipheriv, createDecipheriv, createPrivateKey, createPublicKey, privateDecrypt, publicEncrypt, randomBytes } from 'crypto';
import { env } from './env';

interface HybridCiphertext {
  ciphertext: string;
  iv: string;
  authTag: string;
  encryptedKey: string;
}

let cachedPublicKey: Buffer | null = null;
let cachedPrivateKey: Buffer | null = null;

const readKey = async (keyPath: string): Promise<Buffer> => {
  const absolutePath = path.resolve(keyPath);
  return fs.readFile(absolutePath);
};

const loadPublicKey = async (): Promise<Buffer> => {
  if (!cachedPublicKey) {
    cachedPublicKey = await readKey(env.RSA_PUBLIC_KEY_PATH);
  }
  return cachedPublicKey;
};

const loadPrivateKey = async (): Promise<Buffer> => {
  if (!cachedPrivateKey) {
    cachedPrivateKey = await readKey(env.RSA_PRIVATE_KEY_PATH);
  }
  return cachedPrivateKey;
};

export const generateAesKey = (): Buffer => {
  if (env.AES_KEY_ENV_OPTIONAL) {
    const buffer = Buffer.from(env.AES_KEY_ENV_OPTIONAL, 'utf-8');
    if (buffer.length >= 32) {
      return buffer.subarray(0, 32);
    }
    const padded = Buffer.alloc(32);
    buffer.copy(padded);
    return padded;
  }
  return randomBytes(32); // 256 bits
};

export const encryptHybrid = async (payload: unknown, key?: Buffer): Promise<HybridCiphertext> => {
  const aesKey = key ?? generateAesKey();
  const iv = randomBytes(12); // recommended for GCM
  const cipher = createCipheriv('aes-256-gcm', aesKey, iv);
  const plaintext = Buffer.from(JSON.stringify(payload), 'utf8');
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const authTag = cipher.getAuthTag();

  const publicKeyPem = await loadPublicKey();
  const publicKey = createPublicKey(publicKeyPem);
  const encryptedKey = publicEncrypt(publicKey, aesKey);

  return {
    ciphertext: encrypted.toString('base64'),
    iv: iv.toString('base64'),
    authTag: authTag.toString('base64'),
    encryptedKey: encryptedKey.toString('base64')
  };
};

export const decryptHybrid = async (data: HybridCiphertext): Promise<unknown> => {
  const privateKeyPem = await loadPrivateKey();
  const privateKey = createPrivateKey(privateKeyPem);
  const aesKey = privateDecrypt(privateKey, Buffer.from(data.encryptedKey, 'base64'));

  const decipher = createDecipheriv('aes-256-gcm', aesKey, Buffer.from(data.iv, 'base64'));
  decipher.setAuthTag(Buffer.from(data.authTag, 'base64'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(data.ciphertext, 'base64')),
    decipher.final()
  ]);

  const text = decrypted.toString('utf8');
  return JSON.parse(text);
};

export const hybridPackageToJSON = (data: HybridCiphertext): string => JSON.stringify(data);
export const hybridPackageFromJSON = (data: string): HybridCiphertext => JSON.parse(data);

export type { HybridCiphertext };
