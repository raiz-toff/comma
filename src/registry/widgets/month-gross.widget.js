import { formatCurrency } from '../../utils/formatters.js';
import { t }              from '../../utils/strings.js';
import { esc }            from './esc.js';

const _IC_DOLLAR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>`;

export default {
  id: 'monthGross',
  label: 'Monthly Earnings',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'analytics',

  render: async (ctx) => {
    const c        = /** @type {any} */ (ctx);
    const val      = Number(c?.data?.monthSummary?.gross)  || 0;
    const country  = String(c?.data?.localeCountry || 'US');
    const currency = String(c?.data?.currency      || 'USD');
    const month    = new Date().toLocaleString('default', { month: 'short' });

    return `
      <div class="wr">
        <div class="wh">
          <div class="wi">${_IC_DOLLAR}</div>
          <span class="wl">${esc(t('analytics.earnings'))}</span>
          <span class="wb">${month}</span>
        </div>
        <div class="wv">${esc(formatCurrency(val, country, { currency }))}</div>
        <div class="ws">this month's gross</div>
      </div>`;
  },
  afterRender: (_el, _ctx) => {},
  destroy:     (_el)       => {},
};
