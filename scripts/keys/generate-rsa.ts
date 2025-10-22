import { generateKeyPairSync } from 'crypto';
import { writeFileSync, mkdirSync } from 'fs';
import path from 'path';

const generateKeys = (targetDir: string) => {
  const { privateKey, publicKey } = generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    },
    privateKeyEncoding: {
      type: 'pkcs1',
      format: 'pem'
    }
  });

  mkdirSync(targetDir, { recursive: true });

  writeFileSync(path.join(targetDir, 'rsa_private.pem'), privateKey, { encoding: 'utf-8', mode: 0o600 });
  writeFileSync(path.join(targetDir, 'rsa_public.pem'), publicKey, { encoding: 'utf-8', mode: 0o644 });

  console.log('Llaves RSA generadas en', targetDir);
};

const outputDir = process.argv[2] ?? path.resolve(process.cwd(), 'secrets');
generateKeys(outputDir);
