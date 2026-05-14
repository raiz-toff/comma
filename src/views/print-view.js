function esc(v) {
  return String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/** @param {HTMLElement} root @param {Record<string, unknown>} ctx */
export function render(root, ctx) {
  const container = document.createElement('div');
  container.className = 'print-view-container';
  root.appendChild(container);

  void ctx;
  let payload = null;
  try {
    payload = JSON.parse(sessionStorage.getItem('macadam_print_payload') || 'null');
  } catch {
    payload = null;
  }

  if (!payload?.report) {
    container.innerHTML = `
      <section class="card card-raised">
        <h1>Print report</h1>
        <p style="margin-top:var(--space-2);color:var(--color-text-secondary);">
          No report payload found. Open reports and choose "Open print view".
        </p>
      </section>
    `;
    return;
  }

  const template = payload.template?.sections || {};
  const report = payload.report;
  const summary = report.summary || {};
  container.innerHTML = `
    <section class="print-view">
      <header class="card card-raised">
        <h1>Printable report</h1>
        <p>${esc(report.startDate)} to ${esc(report.endDate)}</p>
      </header>
      ${
        template.overview !== false
          ? `<section class="card" style="margin-top:var(--space-3);">
              <h2>Overview</h2>
              <p>Gross: <strong>${esc(Number(summary.gross || 0).toFixed(2))}</strong></p>
              <p>Expenses: <strong>${esc(Number(summary.expenseTotal || 0).toFixed(2))}</strong></p>
              <p>Net: <strong>${esc(Number(summary.net || 0).toFixed(2))}</strong></p>
              <p>Shifts: <strong>${esc(summary.shiftCount || 0)}</strong></p>
            </section>`
          : ''
      }
      ${
        template.notes
          ? `<section class="card" style="margin-top:var(--space-3);">
              <h2>Notes</h2>
              <pre style="white-space:pre-wrap;">${esc(payload.summaryText || '')}</pre>
            </section>`
          : ''
      }
      <section class="card print-controls" style="margin-top:var(--space-3); border: 2px solid var(--color-brand); background: var(--color-bg-secondary);">
        <h2 style="margin-top:0;">Ready to print</h2>
        <p style="font-size: var(--text-sm); color: var(--color-text-secondary); margin-bottom: var(--space-4);">The print dialog should open automatically. If not, click the button below.</p>
        <div style="display:flex; gap: var(--space-2);">
          <button class="btn btn-primary" type="button" data-action="print">Print now</button>
          <button class="btn btn-secondary" type="button" data-action="close">Close window</button>
        </div>
      </section>
    </section>
  `;

  container.addEventListener('click', (e) => {
    const target = e.target instanceof HTMLElement ? e.target.closest('[data-action]') : null;
    if (!target) return;
    const action = target.getAttribute('data-action');
    if (action === 'print') {
      window.print();
    }
    if (action === 'close') {
      window.close();
    }
  });

  // Auto-trigger print after render
  setTimeout(() => {
    window.print();
  }, 500);
}
