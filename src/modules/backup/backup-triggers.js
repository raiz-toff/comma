/**
 * COMMA — Backup Triggers
 * Manages when backups should be triggered based on user activity and app state.
 */

import { bus, SHIFT_SAVED, SHIFT_DELETED, EXPENSE_SAVED, GOAL_UPDATED, PLATFORM_CHANGED, DATA_IMPORTED, ONBOARDING_COMPLETE } from '../../core/events.js';
import { runBackup } from './backup-engine.js';
import { isDriveConnected, requestToken, getAccessToken } from './drive-auth.js';
import { getAppState } from '../../core/db.js';
import { store } from '../../core/store.js';

const DEBOUNCE_MS = 90 * 1000; // 90 seconds
const STALENESS_THRESHOLD_MS = 6 * 60 * 60 * 1000; // 6 hours
let debounceTimer = null;

/**
 * Initializes all backup triggers.
 * Call this at app startup.
 */
export async function initBackupTriggers() {
  // 1. Listen for data-changing events
  const dataEvents = [
    SHIFT_SAVED,
    SHIFT_DELETED,
    EXPENSE_SAVED,
    GOAL_UPDATED,
    PLATFORM_CHANGED,
    DATA_IMPORTED,
    ONBOARDING_COMPLETE
  ];

  dataEvents.forEach(event => {
    bus.on(event, () => {
      markVaultDirty();
      scheduleDebouncedBackup();
    });
  });

  // 2. Listen for app visibility changes (Trigger 2)
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && isVaultDirty() && !store.get('demoMode')) {
      // User is leaving — try a background backup immediately
      runBackup({ silent: true }).catch(() => {});
    }
  });

  // 3. Staleness check on app open (Trigger 3)
  checkStaleness();
}

/**
 * Marks the vault as dirty in localStorage.
 */
function markVaultDirty() {
  localStorage.setItem('comma_vault_dirty', 'true');
  localStorage.setItem('comma_vault_dirty_at', new Date().toISOString());
}

/**
 * Checks if the vault is currently dirty.
 */
function isVaultDirty() {
  return localStorage.getItem('comma_vault_dirty') === 'true';
}

/**
 * Schedules a backup with a debounce timer.
 */
function scheduleDebouncedBackup() {
  if (debounceTimer) clearTimeout(debounceTimer);
  
  debounceTimer = setTimeout(async () => {
    if (isVaultDirty() && isDriveConnected() && navigator.onLine && !store.get('demoMode')) {
      await runBackup({ silent: true });
    }
  }, DEBOUNCE_MS);
}

/**
 * Checks if the last backup is older than the staleness threshold.
 */
async function checkStaleness() {
  if (!isDriveConnected() || !navigator.onLine || store.get('demoMode')) return;

  const lastBackupAt = await getAppState('last_backup');
  if (!lastBackupAt) {
    // Never backed up
    runBackup({ silent: true }).catch(() => {});
    return;
  }

  const lastMs = new Date(lastBackupAt).getTime();
  const nowMs = Date.now();

  if (nowMs - lastMs > STALENESS_THRESHOLD_MS) {
    // Backup is stale, run one silently
    runBackup({ silent: true }).catch(() => {});
  }
}
