import { formatLargeNumber } from '../../utils/formatters.js';
import { t }                 from '../../utils/strings.js';
import { esc }               from './esc.js';

const _IC_PKG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>`;

export default {
  id: 'monthOrders',
  label: 'Monthly Orders',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'analytics',

  render: async (ctx) => {
    const c     = /** @type {any} */ (ctx);
    const n     = Math.round(Number(c?.data?.monthSummary?.orders) || 0);
    const month = new Date().toLocaleString('default', { month: 'short' });
    const daily = n > 0 ? (n / new Date().getDate()).toFixed(1) : null;

    return `
      <div class="wr">
        <div class="wh">
          <div class="wi">${_IC_PKG}</div>
          <span class="wl">${esc(t('analytics.orders'))}</span>
          <span class="wb">${month}</span>
        </div>
        <div class="wv">${esc(formatLargeNumber(n))}</div>
        ${daily ? `<div class="ws">${esc(daily)} orders / day avg</div>` : '<div class="ws">this month</div>'}
      </div>`;
  },
  afterRender: (_el, _ctx) => {},
  destroy:     (_el)       => {},
};
