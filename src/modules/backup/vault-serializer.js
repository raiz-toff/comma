/**
 * COMMA — Vault Serializer
 * Handles converting the Dexie database to a portable JSON format and back.
 */

import { db, CURRENT_LOGICAL_SCHEMA_VERSION, getAppState } from '../../core/db.js';

/**
 * Serializes the entire database into a JSON structure.
 * @returns {Promise<string>} JSON string
 */
export async function serializeVault() {
  const tables = {};
  
  // We serialize all tables to ensure full fidelity
  for (const table of db.tables) {
    tables[table.name] = await table.toArray();
  }

  const payload = {
    exportedAt: new Date().toISOString(),
    schemaVersion: await getAppState('schema_version') || CURRENT_LOGICAL_SCHEMA_VERSION,
    tables: tables
  };

  return JSON.stringify(payload);
}

/**
 * Validates and restores a vault from a JSON object.
 * @param {Object} data 
 * @returns {Promise<{success: boolean, error?: string}>}
 */
export async function deserializeVault(data) {
  if (!data || typeof data !== 'object') {
    return { success: false, error: 'Invalid vault data format.' };
  }

  if (!data.tables || typeof data.tables !== 'object') {
    return { success: false, error: 'Vault is missing data tables.' };
  }

  // Basic validation of schema version
  const backupVersion = Number(data.schemaVersion) || 0;
  if (backupVersion > CURRENT_LOGICAL_SCHEMA_VERSION) {
    return { 
      success: false, 
      error: `This backup was made with a newer version of Comma (v${backupVersion}). Please update the app first.` 
    };
  }

  try {
    await db.transaction('rw', db.tables, async () => {
      // 1. Clear all current tables
      for (const table of db.tables) {
        await table.clear();
      }

      // 2. Import data into each table
      for (const [tableName, rows] of Object.entries(data.tables)) {
        const table = db.table(tableName);
        if (table && Array.isArray(rows)) {
          // Use bulkPut to preserve IDs and handle potential overlaps
          await table.bulkPut(rows);
        }
      }
    });

    // Note: Migration logic (if backupVersion < current) will be handled 
    // by the database initialization flow after reload or by the restore engine.
    
    return { success: true };
  } catch (err) {
    console.error('[vault-serializer] Restore failed', err);
    return { success: false, error: err.message || 'Failed to write to local database.' };
  }
}
