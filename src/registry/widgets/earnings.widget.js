import { formatCurrency } from '../../utils/formatters.js';
import { t } from '../../utils/strings.js';
import { esc } from './esc.js';

const _IC_EARNINGS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>`;

export default {
  id: 'earnings',
  label: 'Earnings',
  defaultSize: '1x1',
  defaultVisible: true,
  category: 'stats',

  /** @param {unknown} ctx */
  render: async (ctx) => {
    const c = /** @type {{ data?: { financial?: { gross?: number, expense?: number }; weekCompare?: { delta: number, thisGross: number, lastGross: number }; rollingTrend?: { points: {y:number}[] }; localeCountry?: string; currency?: string } }} */ (ctx);
    
    const gross = Number(c?.data?.financial?.gross || 0);
    const country = String(c?.localeCountry || 'US');
    const currency = String(c?.currency || 'USD');
    
    // Week-over-Week Comparison
    const delta = c?.data?.weekCompare?.delta || 0;
    const isUp = delta >= 0;
    const deltaPct = c?.data?.weekCompare?.lastGross > 0 
      ? Math.abs((delta / c.data.weekCompare.lastGross) * 100).toFixed(1) 
      : '0.0';

    // Sparkline points (last 7 days of the rolling trend)
    const points = c?.data?.rollingTrend?.points?.slice(-7).map(p => p.y) || [0,0,0,0,0,0,0];
    const maxP = Math.max(...points, 1);
    const minP = Math.min(...points);
    const rangeP = (maxP - minP) || 1;

    // SVG Sparkline Geometry
    const svgW = 100;
    const svgH = 30;
    const sparkPath = points.map((p, i) => {
      const x = (i / (points.length - 1)) * svgW;
      const y = svgH - ((p - minP) / rangeP) * svgH;
      return `${x},${y}`;
    }).join(' L ');

    const scopedStyles = `
      <style>
        @keyframes ernSlideUp {
          from { transform: translateY(10px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes ernDrawPath {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes ernPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .ern-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
          position: relative;
          padding: 2px;
        }

        .ern-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          z-index: 2;
        }

        .ern-icon-box {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: color-mix(in srgb, var(--widget-accent, #3b82f6) 15%, transparent);
          color: var(--widget-accent, #3b82f6);
        }

        .ern-delta-badge {
          font-size: 0.65rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          gap: 2px;
          padding: 2px 6px;
          border-radius: 6px;
          text-transform: uppercase;
          letter-spacing: 0.02em;
        }
        .ern-up { background: color-mix(in srgb, var(--color-success) 12%, transparent); color: var(--color-success); }
        .ern-down { background: color-mix(in srgb, var(--color-danger) 12%, transparent); color: var(--color-danger); }

        .ern-body {
          margin-top: 8px;
          z-index: 2;
          animation: ernSlideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        .ern-val {
          font-size: 2.2rem;
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.04em;
          color: var(--color-text-main);
          font-variant-numeric: tabular-nums;
        }

        .ern-label {
          font-size: 0.7rem;
          font-weight: 700;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 4px;
        }

        .ern-spark-wrap {
          position: absolute;
          bottom: -4px;
          left: -4px;
          right: -4px;
          height: 40px;
          z-index: 1;
          pointer-events: none;
          opacity: 0.4;
        }
        .ern-spark-svg {
          width: 100%;
          height: 100%;
          overflow: visible;
        }
        .ern-spark-path {
          fill: none;
          stroke: var(--widget-accent, #3b82f6);
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 200;
          stroke-dashoffset: 200;
          animation: ernDrawPath 1.2s ease-out forwards 0.2s;
        }
      </style>
    `;

    const deltaIcon = isUp 
      ? `<svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="18 15 12 9 6 15"></polyline></svg>`
      : `<svg width="10" height="10" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></svg>`;

    return `
      ${scopedStyles}
      <div class="ern-container">
        <div class="ern-header">
          <div class="ern-icon-box">${_IC_EARNINGS}</div>
          <div class="ern-delta-badge ${isUp ? 'ern-up' : 'ern-down'}">
            ${deltaIcon}
            ${deltaPct}%
          </div>
        </div>

        <div class="ern-body">
          <div class="ern-val">${esc(formatCurrency(gross, country, { currency }))}</div>
          <div class="ern-label">${esc(t('analytics.earnings'))}</div>
        </div>

        <!-- Background Growth Sparkline -->
        <div class="ern-spark-wrap">
          <svg class="ern-spark-svg" viewBox="0 0 ${svgW} ${svgH}" preserveAspectRatio="none">
            <path class="ern-spark-path" d="M ${sparkPath}"></path>
          </svg>
        </div>
      </div>
    `;
  },

  afterRender: (_el, _ctx) => {},
  destroy: (_el) => {},
};
