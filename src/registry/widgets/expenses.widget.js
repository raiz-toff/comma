import { formatCurrency } from '../../utils/formatters.js';
import { t } from '../../utils/strings.js';
import { esc } from './esc.js';

export default {
  id: 'expenses',
  label: 'Expenses',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'financial',

  /** @param {unknown} ctx */
  render: async (ctx) => {
    const c = /** @type {{ data?: { financial?: { expense?: number, gross?: number }; localeCountry?: string; currency?: string } }} */ (ctx);
    
    // Fallbacks and safe extraction
    const expense = Number(c?.data?.financial?.expense) || 0;
    const gross = Number(c?.data?.financial?.gross) || 0;
    const country = String(c?.data?.localeCountry || 'US');
    const currency = String(c?.data?.currency || 'USD');

    // Calculate the "Burn Rate" (Expense Ratio)
    let ratio = gross > 0 ? (expense / gross) * 100 : 0;
    
    // Handle edge case where expenses exist but gross is 0
    if (gross === 0 && expense > 0) ratio = 100;
    
    // Cap at 100% for the SVG geometry math
    const safeRatio = Math.min(100, Math.max(0, ratio));

    let healthText = 'Moderate Burn';
    let healthClass = 'exp-badge-warn'; // Default to a warning/neutral state
    
    if (safeRatio <= 20 && expense > 0) {
      healthText = 'Highly Efficient';
      healthClass = 'exp-badge-good';
    } else if (safeRatio > 40) {
      healthText = 'High Burn Rate';
      healthClass = 'exp-badge-bad';
    } else if (expense === 0) {
      healthText = 'No Expenses Logged';
      healthClass = 'exp-badge-neutral';
    }

    const fmtExpense = formatCurrency(expense, country, { currency });
    const labelText = t('views.dashboard.financial.expensesMetric') || 'Expenses';

    // The geometry for a half-circle SVG arc with r=40
    // Circumference of a half circle: pi * r = 3.14159 * 40 ≈ 125.66
    const arcLength = 125.66;
    const targetOffset = arcLength - (arcLength * (safeRatio / 100));

    const scopedStyles = `
      <style>
        /* Smooth gauge filling animation */
        @keyframes fillBurnGauge {
          from { stroke-dashoffset: ${arcLength}; }
          to { stroke-dashoffset: ${targetOffset}; }
        }
        
        /* Subtle entrance scale for the value */
        @keyframes popValue {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        
        /* Alert pulse for bad burn rates */
        @keyframes dangerPulse {
          0%, 100% { box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-danger, #f43f5e) 40%, transparent); }
          50% { box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-danger, #f43f5e) 0%, transparent); }
        }

        .exp-container { display: flex; flex-direction: column; height: 100%; justify-content: space-between; padding: 4px; position: relative; }
        
        /* Header Elements */
        .exp-header { display: flex; align-items: center; gap: 10px; position: relative; z-index: 2; }
        .exp-icon-wrap {
          display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; 
          border-radius: 8px; background: color-mix(in srgb, var(--widget-accent, #f43f5e) 15%, transparent); 
          color: var(--widget-accent, #f43f5e);
        }

        /* Typography */
        .exp-main-value { 
          font-size: 2.1rem; 
          font-weight: 800; 
          line-height: 1.1; 
          letter-spacing: -0.03em; 
          color: var(--color-text-main); 
          margin-top: 10px;
          animation: popValue 0.4s cubic-bezier(0.2, 0.8, 0.2, 1);
        }

        /* Gauge Area */
        .exp-gauge-section {
          position: relative;
          margin-top: auto;
          width: 100%;
          display: flex;
          justify-content: center;
          padding-top: 12px;
        }
        
        .exp-svg {
          width: 100%;
          max-width: 140px;
          overflow: visible;
        }

        .exp-track {
          fill: none;
          stroke: var(--color-surface-raised, rgba(150, 150, 150, 0.15));
          stroke-width: 10;
          stroke-linecap: round;
        }

        .exp-fill-arc {
          fill: none;
          stroke: var(--widget-accent, #f43f5e);
          stroke-width: 10;
          stroke-linecap: round;
          stroke-dasharray: ${arcLength};
          stroke-dashoffset: ${arcLength}; /* Start empty */
          animation: fillBurnGauge 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) 0.2s forwards;
        }

        /* Inner Text aligned to the bottom center of the half-circle */
        .exp-gauge-text {
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }

        .exp-pct {
          font-size: 1.1rem;
          font-weight: 800;
          color: var(--widget-accent, #f43f5e);
          font-variant-numeric: tabular-nums;
          line-height: 1;
        }

        /* Status Badge */
        .exp-badge {
          font-size: 0.6rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          padding: 2px 6px;
          border-radius: 4px;
          margin-top: 4px;
          white-space: nowrap;
        }
        
        .exp-badge-good { color: var(--color-success, #10b981); background: color-mix(in srgb, var(--color-success) 15%, transparent); }
        .exp-badge-warn { color: var(--color-warning, #f5a623); background: color-mix(in srgb, var(--color-warning) 15%, transparent); }
        .exp-badge-neutral { color: var(--color-text-muted); background: var(--color-surface-raised); }
        .exp-badge-bad { 
          color: var(--color-danger, #f43f5e); 
          background: color-mix(in srgb, var(--color-danger) 15%, transparent);
          animation: dangerPulse 2s infinite; 
        }
      </style>
    `;

    return `
      ${scopedStyles}
      <div class="exp-container">
        
        <!-- Header -->
        <div class="exp-header">
          <div class="exp-icon-wrap">
            <!-- Receipt / Burn Icon -->
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16l4-2 4 2 4-2 4 2V8z"></path>
              <polyline points="14 2 14 8 20 8"></polyline>
              <line x1="16" y1="13" x2="8" y2="13"></line>
              <line x1="16" y1="17" x2="8" y2="17"></line>
            </svg>
          </div>
          <span class="stat-label">${esc(labelText)}</span>
        </div>

        <!-- Big Dollar Outflow Number -->
        <div class="exp-main-value">
          ${esc(fmtExpense)}
        </div>

        <!-- Burn Rate SVG Gauge -->
        <div class="exp-gauge-section">
          <!-- The Half-Circle SVG -->
          <svg class="exp-svg" viewBox="0 0 100 55" preserveAspectRatio="xMidYMax meet">
            <!-- Background Arc -->
            <path class="exp-track" d="M 10 50 A 40 40 0 0 1 90 50"></path>
            <!-- Animated Fill Arc -->
            <path class="exp-fill-arc" d="M 10 50 A 40 40 0 0 1 90 50"></path>
          </svg>
          
          <!-- Absolute Positioned Internal Text -->
          <div class="exp-gauge-text">
            <span class="exp-pct">${safeRatio.toFixed(1)}%</span>
            <span class="exp-badge ${healthClass}">${esc(healthText)}</span>
          </div>
        </div>

      </div>
    `;
  },
  
  afterRender: (_el, _ctx) => {},
  destroy: (_el) => {},
};
