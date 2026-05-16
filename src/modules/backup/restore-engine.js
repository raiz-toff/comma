/**
 * COMMA — Restore Engine
 * Orchestrates the full restore flow: Download → Decrypt → Validate → Write.
 */

import { deserializeVault } from './vault-serializer.js';
import { 
  getActiveKey, 
  setActiveKey, 
  importKeyFromJwk, 
  decryptVault 
} from './encryption.js';
import { 
  listAppDataFiles, 
  downloadFile 
} from './drive-api.js';
import { getAccessToken, isDriveConnected } from './drive-auth.js';
import { bus } from '../../core/events.js';

/**
 * Fetches a list of available backups from Drive with metadata.
 * Does NOT decrypt the ciphertext, only reads the unencrypted wrapper.
 */
export async function listAvailableBackups() {
  if (!isDriveConnected()) return [];
  
  const files = await listAppDataFiles();
  const backupFiles = files.filter(f => f.name.startsWith('comma-vault'));
  
  const results = [];
  for (const file of backupFiles) {
    try {
      const blob = await downloadFile(file.id);
      const text = await blob.text();
      const wrapper = JSON.parse(text);
      
      if (wrapper.magic === 'COMMA_VAULT') {
        results.push({
          id: file.id,
          name: file.name,
          encryptedAt: wrapper.encryptedAt,
          appVersion: wrapper.appVersion,
          schemaVersion: wrapper.schemaVersion,
          deviceHint: wrapper.deviceHint,
          // We could potentially add more metadata to the wrapper like shift count
        });
      }
    } catch (err) {
      console.warn(`[restore-engine] Failed to read metadata for ${file.name}:`, err);
    }
  }

  // Sort by date descending
  return results.sort((a, b) => new Date(b.encryptedAt) - new Date(a.encryptedAt));
}

/**
 * Runs the full restore process for a specific file.
 * @param {string} fileId 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function runRestore(fileId) {
  if (!navigator.onLine) return { success: false, error: 'No internet connection.' };

  try {
    bus.emit('restore:started');

    // 1. Download the .comdb file
    const blob = await downloadFile(fileId);
    const text = await blob.text();
    const wrapper = JSON.parse(text);

    // 2. Validate wrapper
    if (wrapper.magic !== 'COMMA_VAULT') {
      throw new Error('Invalid backup file format.');
    }

    // 3. Ensure we have the key
    let key = getActiveKey();
    if (!key) {
      key = await fetchKeyFromDrive();
    }

    // 4. Decrypt
    const decryptedBytes = await decryptVault(wrapper.iv, wrapper.ciphertext, key);
    const decoder = new TextEncoder();
    const jsonString = new TextDecoder().decode(decryptedBytes);
    const vaultData = JSON.parse(jsonString);

    // 5. Restore to Dexie
    const result = await deserializeVault(vaultData);
    
    if (result.success) {
      bus.emit('restore:success');
      // The caller should handle the page reload / state refresh
      return { success: true };
    } else {
      throw new Error(result.error || 'Restore failed during database write.');
    }

  } catch (err) {
    console.error('[restore-engine] Restore failed:', err);
    bus.emit('restore:failed', { error: err.message });
    return { success: false, error: err.message };
  }
}

/**
 * Helper to fetch and import the key from Drive.
 */
async function fetchKeyFromDrive() {
  const files = await listAppDataFiles();
  const keyFile = files.find(f => f.name === 'comma-key.json');
  
  if (!keyFile) throw new Error('Encryption key not found in Google Drive. Cannot decrypt backup.');

  const blob = await downloadFile(keyFile.id);
  const text = await blob.text();
  const jwk = JSON.parse(text);
  const key = await importKeyFromJwk(jwk);
  setActiveKey(key);
  return key;
}
