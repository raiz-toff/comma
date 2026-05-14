import { formatCurrency } from '../../utils/formatters.js';
import { t }              from '../../utils/strings.js';
import { esc }            from './esc.js';

const _IC_TREND_UP = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`;

export default {
  id: 'netIncome',
  label: 'Net Income',
  defaultSize: '1x1',
  defaultVisible: true,
  category: 'financial',

  render: async (ctx) => {
    const c        = /** @type {any} */ (ctx);
    const net      = Number(c?.data?.financial?.netIncome) || 0;
    const gross    = Number(c?.data?.financial?.gross)     || 0;
    const country  = String(c?.data?.localeCountry || 'US');
    const currency = String(c?.data?.currency      || 'USD');

    const margin   = gross > 0 ? Math.round((net / gross) * 100) : null;
    const pct      = margin !== null ? Math.min(100, Math.max(0, margin)) : 0;
    const badge    = margin !== null ? (margin > 70 ? 'pos' : margin > 40 ? 'warn' : 'neg') : 'neu';

    return `
      <div class="wr">
        <div class="wh">
          <div class="wi">${_IC_TREND_UP}</div>
          <span class="wl">${esc(t('views.dashboard.financial.netIncome'))}</span>
          ${margin !== null ? `<span class="wb ${badge}">${margin}% margin</span>` : ''}
        </div>
        <div class="wv">${esc(formatCurrency(net, country, { currency }))}</div>
        ${margin !== null ? `
        <div class="wpb">
          <div class="wpf" style="width:${pct}%"></div>
        </div>
        <div class="ws" style="font-size:10px">of ${esc(formatCurrency(gross, country, { currency }))} gross</div>` : ''}
      </div>`;
  },
  afterRender: (_el, _ctx) => {},
  destroy:     (_el)       => {},
};
