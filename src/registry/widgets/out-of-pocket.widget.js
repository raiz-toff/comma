import { formatCurrency } from '../../utils/formatters.js';
import { t }              from '../../utils/strings.js';
import { esc }            from './esc.js';

const _IC_CARD = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>`;

export default {
  id: 'outOfPocket',
  label: 'Out of Pocket',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'financial',

  render: async (ctx) => {
    const c        = /** @type {any} */ (ctx);
    const val      = Number(c?.data?.financial?.outOfPocket) || 0;
    const gross    = Number(c?.data?.financial?.gross)       || 0;
    const country  = String(c?.data?.localeCountry || 'US');
    const currency = String(c?.data?.currency      || 'USD');
    const pct      = gross > 0 ? ((val / gross) * 100).toFixed(1) : null;

    return `
      <div class="wr">
        <div class="wh">
          <div class="wi">${_IC_CARD}</div>
          <span class="wl">${esc(t('views.dashboard.financial.outOfPocket'))}</span>
          ${pct ? `<span class="wb neg">${pct}% of gross</span>` : ''}
        </div>
        <div class="wv" style="color:#f43f5e">−${esc(formatCurrency(val, country, { currency }))}</div>
        <div class="ws">real out-of-pocket costs</div>
      </div>`;
  },
  afterRender: (_el, _ctx) => {},
  destroy:     (_el)       => {},
};
