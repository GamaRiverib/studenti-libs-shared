import {
  createHash,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} from 'crypto';

const keywordFilePath = process.env.STUDENTI_KEYWORDS_FILE_PATH || './keywords.json';

const keywords = require(keywordFilePath);

const ALGORITHM =
  process.env.STUDENTI_KEYWORDS_CRYPTO_ALGORITHM || 'aes-256-ctr';
const SECRET =
  process.env.STUDENTI_KEYWORDS_CRYPTO_SECRET ||
  'https://gamariverib.dev/studenti';

/**
 * Aplica una función hash sobre un texto de entrada.
 * @param {string} str Texto de entrada
 * @returns {string} Texto de salida
 */
export function getKeywordHash(str: string): string {
  return createHash('md5').update(str, 'utf8').digest('hex').toUpperCase();
}

/**
 * Valida si la palabra clave proporcionada corresponde a la registrada.
 * @param {string} savedKeywordHash Palabra clave almacenada.
 * @param {string} testKeywordHash Palabra clave a validar.
 */
export function validateKeywordHash(
  savedKeywordHash: string,
  testKeywordHash: string,
): void {
  // En la palabra clave no importan las mayúsculas y minúsculas.
  const hash = getKeywordHash(testKeywordHash.toUpperCase());
  if (savedKeywordHash !== hash) {
    throw new Error('Keyword no match');
  }
}

export function getRandomKeyword(): string {
  return keywords[Math.floor(Math.random() * keywords.length)];
}

export function encryptKeyword(keyword: string): string {
  const iv = randomBytes(16);
  const cipher = createCipheriv(ALGORITHM, SECRET, iv);
  const encrypted = Buffer.concat([cipher.update(keyword), cipher.final()]);
  return `${iv.toString('hex')}:${encrypted.toString('hex')}`;
}

export function decryptKeyword(encryptedKeyword: string): string {
  const [iv, encrypted] = encryptedKeyword.split(':');
  if (!iv?.length || !encrypted?.length) {
    return encryptedKeyword;
  }
  const decipher = createDecipheriv(ALGORITHM, SECRET, Buffer.from(iv, 'hex'));
  const decrypted = Buffer.concat([
    decipher.update(Buffer.from(encrypted, 'hex')),
    decipher.final(),
  ]);
  return decrypted.toString();
}
