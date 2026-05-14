import { formatCurrency } from '../../utils/formatters.js';
import { t }              from '../../utils/strings.js';
import { esc }            from './esc.js';

const _IC_CLOCK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`;

export default {
  id: 'monthHourly',
  label: 'Monthly $/hr',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'analytics',

  render: async (ctx) => {
    const c        = /** @type {any} */ (ctx);
    const val      = Number(c?.data?.monthSummary?.hourlyRate) || 0;
    const country  = String(c?.data?.localeCountry || 'US');
    const currency = String(c?.data?.currency      || 'USD');
    const month    = new Date().toLocaleString('default', { month: 'short' });

    return `
      <div class="wr">
        <div class="wh">
          <div class="wi">${_IC_CLOCK}</div>
          <span class="wl">${esc(t('analytics.hourlyRate'))}</span>
          <span class="wb">${month}</span>
        </div>
        <div class="wv">${esc(formatCurrency(val, country, { currency }))}</div>
        <div class="ws">hourly rate this month</div>
      </div>`;
  },
  afterRender: (_el, _ctx) => {},
  destroy:     (_el)       => {},
};
