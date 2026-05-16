/**
 * COMMA — Encryption Module
 * AES-GCM 256-bit encryption for local-first data vaults.
 * Uses Web Crypto API. No external dependencies.
 */

/** @type {CryptoKey | null} */
let activeKey = null;

/**
 * Generates a new AES-GCM 256-bit encryption key.
 * @returns {Promise<CryptoKey>}
 */
export async function generateVaultKey() {
  return window.crypto.subtle.generateKey(
    {
      name: 'AES-GCM',
      length: 256,
    },
    true, // extractable (so we can save it to Drive)
    ['encrypt', 'decrypt']
  );
}

/**
 * Exports a CryptoKey to JWK (JSON Web Key) format for storage.
 * @param {CryptoKey} key 
 * @returns {Promise<Object>}
 */
export async function exportKeyToJwk(key) {
  return window.crypto.subtle.exportKey('jwk', key);
}

/**
 * Imports a CryptoKey from JWK (JSON Web Key) format.
 * @param {Object} jwk 
 * @returns {Promise<CryptoKey>}
 */
export async function importKeyFromJwk(jwk) {
  return window.crypto.subtle.importKey(
    'jwk',
    jwk,
    {
      name: 'AES-GCM',
      length: 256,
    },
    true,
    ['encrypt', 'decrypt']
  );
}

/**
 * Encrypts a Uint8Array using AES-GCM.
 * @param {Uint8Array} plaintextBytes 
 * @param {CryptoKey} key 
 * @returns {Promise<{iv: string, ciphertext: string}>} Base64 strings
 */
export async function encryptVault(plaintextBytes, key) {
  // Generate a fresh 12-byte IV for every encryption operation
  const iv = window.crypto.getRandomValues(new Uint8Array(12));
  
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    plaintextBytes
  );

  return {
    iv: arrayBufferToBase64(iv),
    ciphertext: arrayBufferToBase64(encryptedBuffer),
  };
}

/**
 * Decrypts a base64 ciphertext using AES-GCM.
 * @param {string} ivBase64 
 * @param {string} ciphertextBase64 
 * @param {CryptoKey} key 
 * @returns {Promise<Uint8Array>}
 */
export async function decryptVault(ivBase64, ciphertextBase64, key) {
  const iv = base64ToArrayBuffer(ivBase64);
  const ciphertext = base64ToArrayBuffer(ciphertextBase64);

  const decryptedBuffer = await window.crypto.subtle.decrypt(
    {
      name: 'AES-GCM',
      iv: iv,
    },
    key,
    ciphertext
  );

  return new Uint8Array(decryptedBuffer);
}

/**
 * In-memory state management for the key.
 */
export function setActiveKey(key) {
  activeKey = key;
}

export function getActiveKey() {
  return activeKey;
}

export function clearActiveKey() {
  activeKey = null;
}

// --- Utilities ---

/**
 * @param {ArrayBuffer} buffer 
 * @returns {string}
 */
function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

/**
 * @param {string} base64 
 * @returns {Uint8Array}
 */
function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
