import { formatCurrency } from '../../utils/formatters.js';
import { t } from '../../utils/strings.js';
import { esc } from './esc.js';

const _IC_ZAP = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;

export default {
  id: 'avgRate',
  label: 'Avg $/hr',
  defaultSize: '1x1',
  defaultVisible: true,
  category: 'financial',

  /** @param {unknown} ctx */
  render: async (ctx) => {
    const c = /** @type {{ data?: { financial?: { avgRateHr?: number, hours?: number }; localeCountry?: string; currency?: string } }} */ (ctx);
    
    const rate = Number(c?.data?.financial?.avgRateHr) || 0;
    const hours = Number(c?.data?.financial?.hours) || 0;
    const country = String(c?.data?.localeCountry || 'US');
    const currency = String(c?.data?.currency || 'USD');

    // Intelligence: Efficiency Tiering
    let tier = 'Standard';
    let tierClass = 'ar-tier-standard';
    let tierColor = 'var(--color-text-muted)';
    
    if (rate >= 35) {
      tier = 'Elite';
      tierClass = 'ar-tier-elite';
      tierColor = '#f5a623'; // Gold
    } else if (rate >= 25) {
      tier = 'Pro';
      tierClass = 'ar-tier-pro';
      tierColor = 'var(--color-success)';
    } else if (rate >= 18) {
      tier = 'Active';
      tierClass = 'ar-tier-active';
      tierColor = 'var(--color-info)';
    }

    const fmtRate = formatCurrency(rate, country, { currency });
    const labelText = t('views.dashboard.financial.avgRateHr') || 'Avg $/hr';

    const scopedStyles = `
      <style>
        @keyframes arPulse {
          0% { transform: scale(1); opacity: 0.8; }
          50% { transform: scale(1.05); opacity: 1; }
          100% { transform: scale(1); opacity: 0.8; }
        }
        @keyframes arSlideIn {
          from { transform: translateX(-10px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }

        .ar-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
          padding: 4px;
        }

        .ar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .ar-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: color-mix(in srgb, ${tierColor} 15%, transparent);
          color: ${tierColor};
        }

        .ar-tier-badge {
          font-size: 0.65rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 8px;
          border-radius: 4px;
        }
        .ar-tier-elite { background: color-mix(in srgb, #f5a623 15%, transparent); color: #f5a623; border: 1px solid color-mix(in srgb, #f5a623 30%, transparent); }
        .ar-tier-pro { background: color-mix(in srgb, var(--color-success) 15%, transparent); color: var(--color-success); border: 1px solid color-mix(in srgb, var(--color-success) 30%, transparent); }
        .ar-tier-active { background: color-mix(in srgb, var(--color-info) 15%, transparent); color: var(--color-info); border: 1px solid color-mix(in srgb, var(--color-info) 30%, transparent); }
        .ar-tier-standard { background: var(--color-surface-raised); color: var(--color-text-muted); }

        .ar-body {
          margin-top: 12px;
          animation: arSlideIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .ar-val {
          font-size: 2.1rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.04em;
          color: var(--color-text-main);
          font-variant-numeric: tabular-nums;
        }

        .ar-sub {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-text-muted);
          margin-top: 6px;
        }

        .ar-unit {
          font-size: 0.9rem;
          font-weight: 700;
          color: var(--color-text-muted);
          margin-left: 2px;
        }

        .ar-stars {
          display: flex;
          gap: 2px;
          margin-top: 8px;
          color: ${tierColor};
          opacity: 0.8;
        }
      </style>
    `;

    // Render stars based on tier
    const starCount = rate >= 35 ? 3 : rate >= 25 ? 2 : rate >= 18 ? 1 : 0;
    const starsHTML = Array.from({ length: 3 }).map((_, i) => {
      const active = i < starCount;
      return `<svg width="12" height="12" fill="${active ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
    }).join('');

    return `
      ${scopedStyles}
      <div class="ar-container">
        <div class="ar-header">
          <div class="ar-icon-wrap">${_IC_ZAP}</div>
          <div class="ar-tier-badge ${tierClass}">${esc(tier)}</div>
        </div>

        <div class="ar-body">
          <div class="ar-val">
            ${esc(fmtRate)}<span class="ar-unit">/hr</span>
          </div>
          <div class="ar-sub">
            <span>Avg over ${hours.toFixed(1)} hrs</span>
          </div>
          <div class="ar-stars">
            ${starsHTML}
          </div>
        </div>
      </div>
    `;
  },

  afterRender: (_el, _ctx) => {},
  destroy: (_el) => {},
};
