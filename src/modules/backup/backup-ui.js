/**
 * COMMA — Backup UI
 * Renders the backup status and controls in the Settings -> Data tab.
 */

import { getAccessToken, isDriveConnected, requestToken, disconnectDrive } from './drive-auth.js';
import { runBackup } from './backup-engine.js';
import { listAvailableBackups, runRestore } from './restore-engine.js';
import { getAppState } from '../../core/db.js';
import { bus } from '../../core/events.js';
import { getIcon } from '../../ui/icons.js';
import { t } from '../../utils/strings.js';
import { showConfirm, showToast } from '../../ui/components.js';
import { store } from '../../core/store.js';

/**
 * Renders the backup status section into the provided container.
 * @param {HTMLElement} container 
 */
export async function renderBackupStatus(container) {
  if (!container) return;

  const lastBackupAt = await getAppState('last_backup');
  const connected = isDriveConnected();
  const token = getAccessToken();
  const online = navigator.onLine;

  let statusHtml = '';

  if (!online) {
    statusHtml = renderOfflineState();
  } else if (!connected) {
    statusHtml = renderNotConnectedState();
  } else if (!token) {
    statusHtml = renderDisconnectedState();
  } else {
    statusHtml = await renderConnectedState(lastBackupAt);
  }

  container.innerHTML = `
    <div class="settings-backup-card card card-raised">
      <div class="settings-backup-header">
        <h3 class="settings-subsection-title">${getIcon('vault', 24)} ${t('settings.backupTitle')}</h3>
        <p class="text-secondary text-xs">${t('settings.backupLead')}</p>
      </div>
      <div class="settings-backup-body">
        ${statusHtml}
      </div>
    </div>
  `;

  attachEventListeners(container);
}

function renderOfflineState() {
  return `
    <div class="backup-status-item status-offline">
      <span class="status-icon">${getIcon('wifi-off', 18)}</span>
      <div class="status-content">
        <p class="status-text">${t('settings.backupStatusOffline')}</p>
        <p class="status-subtext">${t('settings.backupStatusOfflineSub')}</p>
      </div>
    </div>
  `;
}

function renderNotConnectedState() {
  return `
    <div class="backup-status-item status-not-connected">
      <span class="status-icon">${getIcon('google-drive', 24)}</span>
      <div class="status-content">
        <p class="status-text">${t('settings.backupConnectBtn')}</p>
        <p class="status-subtext">${t('settings.backupConnectSub')}</p>
      </div>
      <div class="backup-actions">
        <button type="button" class="btn btn-primary btn-sm" data-action="connect-drive">${t('common.confirm') || 'Connect'}</button>
      </div>
    </div>
  `;
}

function renderDisconnectedState() {
  return `
    <div class="backup-status-item status-reconnect">
      <span class="status-icon">${getIcon('google-drive', 24)}</span>
      <div class="status-content">
        <p class="status-text">${t('settings.backupStatusDisconnected')}</p>
        <p class="status-subtext">${t('settings.backupStatusDisconnectedSub')}</p>
      </div>
      <div class="backup-actions">
        <button type="button" class="btn btn-primary btn-sm" data-action="connect-drive">${t('common.retry') || 'Reconnect'}</button>
      </div>
    </div>
  `;
}

async function renderConnectedState(lastBackupAt) {
  const isDemo = store.get('demoMode');
  let statusText = t('settings.backupStatusConnected');
  let subtext = t('settings.backupStatusNone');
  let icon = getIcon('google-drive', 24);
  let overdue = false;

  if (lastBackupAt) {
    const date = new Date(lastBackupAt);
    const now = new Date();
    const diffMs = now - date;
    const isToday = date.toDateString() === now.toDateString();
    
    statusText = isToday ? t('settings.backupStatusToday') : t('settings.backupStatusRecently');
    subtext = `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    
    if (diffMs > 24 * 60 * 60 * 1000) {
      overdue = true;
      icon = getIcon('alert-circle', 18, 'text-warning');
      statusText = t('settings.backupStatusOverdue');
    }
  }

  return `
    <div class="backup-status-item status-connected ${overdue ? 'is-overdue' : ''}">
      <span class="status-icon">${icon}</span>
      <div class="status-content">
        <p class="status-text">${statusText}</p>
        <p class="status-subtext">${subtext}</p>
        ${isDemo ? `<p class="text-warning text-xs mt-1">Backup disabled in Demo Mode</p>` : ''}
      </div>
      <div class="backup-actions">
        <button type="button" class="btn btn-secondary btn-sm" data-action="backup-now" ${isDemo ? 'disabled title="Disabled in Demo Mode"' : ''}>${t('settings.backupNowBtn')}</button>
        <button type="button" class="btn btn-secondary btn-sm" data-action="show-restore">${t('settings.backupRestoreBtn')}</button>
        <button type="button" class="btn btn-ghost btn-xs" data-action="disconnect-drive" title="${t('settings.backupDisconnectBtn')}">${t('common.delete') || 'Disconnect'}</button>
      </div>
    </div>
  `;
}

function attachEventListeners(container) {
  container.addEventListener('click', async (e) => {
    const action = e.target.closest('[data-action]')?.dataset.action;
    if (!action) return;

    switch (action) {
      case 'connect-drive':
        if (store.get('demoMode')) {
          showConfirm({
            title: t('common.warning'),
            message: t('settings.backupDemoWarning'),
            confirmLabel: t('common.ok') || 'OK',
            cancelLabel: ''
          });
          return;
        }
        requestToken();
        break;
      case 'backup-now':
        const btn = e.target.closest('button');
        const originalText = btn.textContent;
        btn.disabled = true;
        btn.textContent = '...';
        const res = await runBackup();
        if (res.success) {
          showToast({ type: 'success', message: t('settings.backupSuccessToast') });
          renderBackupStatus(container);
        } else {
          showToast({ type: 'error', message: res.error || t('settings.backupFailToast') });
          btn.disabled = false;
          btn.textContent = originalText;
        }
        break;
      case 'show-restore':
        renderRestoreList(container);
        break;
      case 'disconnect-drive':
        const confirmed = await showConfirm({
          title: t('settings.backupDisconnectConfirmTitle'),
          message: t('settings.backupDisconnectConfirmMessage'),
          confirmText: t('settings.backupDisconnectBtn'),
          danger: true
        });
        if (confirmed) {
          disconnectDrive();
          renderBackupStatus(container);
        }
        break;
    }
  });
}

async function renderRestoreList(container) {
  container.innerHTML = `
    <div class="settings-backup-card card card-raised">
      <div class="settings-backup-header">
        <button type="button" class="btn btn-ghost btn-xs" data-action="back-to-status">${getIcon('arrow-left', 14)} ${t('common.back')}</button>
        <h3 class="settings-subsection-title">${t('settings.backupRestoreTitle')}</h3>
      </div>
      <div class="settings-backup-body">
        <div class="restore-loading">${t('settings.backupRestoreSearching')}</div>
      </div>
    </div>
  `;

  const backups = await listAvailableBackups();
  const body = container.querySelector('.settings-backup-body');

  if (backups.length === 0) {
    body.innerHTML = `<p class="text-secondary">${t('settings.backupRestoreEmpty')}</p>`;
  } else {
    body.innerHTML = `
      <div class="restore-list">
        ${backups.map(b => `
          <div class="restore-item">
            <div class="restore-info">
              <p class="restore-date">${new Date(b.encryptedAt).toLocaleString()}</p>
              <p class="restore-meta text-xs text-secondary">${b.deviceHint || 'Unknown Device'} · v${b.appVersion}</p>
            </div>
            <button type="button" class="btn btn-secondary btn-sm" data-action="restore-file" data-file-id="${b.id}">${t('settings.backupRestoreBtn')}</button>
          </div>
        `).join('')}
      </div>
    `;
  }

  container.querySelector('[data-action="back-to-status"]').onclick = () => renderBackupStatus(container);
  
  container.querySelectorAll('[data-action="restore-file"]').forEach(btn => {
    btn.onclick = async () => {
      const fileId = btn.dataset.fileId;
      const confirmed = await showConfirm({
        title: t('settings.backupRestoreConfirmTitle'),
        message: t('settings.backupRestoreConfirmMessage'),
        confirmText: t('settings.backupRestoreConfirmText'),
        requireType: 'RESTORE',
        danger: true
      });

      if (confirmed) {
        btn.disabled = true;
        btn.textContent = 'Restoring...';
        const res = await runRestore(fileId);
        if (res.success) {
          showToast({ type: 'success', message: t('settings.backupRestoreSuccessToast') });
          setTimeout(() => window.location.reload(), 1500);
        } else {
          showToast({ type: 'error', message: res.error || t('settings.backupRestoreFailToast') });
          btn.disabled = false;
          btn.textContent = t('settings.backupRestoreBtn');
        }
      }
    };
  });
}
