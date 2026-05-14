
// =============================================================================
// FILE: _TEMPLATE.widget.js
// =============================================================================

/**
 * Copy to `{id}.widget.js`, register in `./index.js`.
 * @see docs/feature_modularity.md — Widget registry (Category B).
 */

export default {
  id: 'example',
  label: 'Example widget',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'misc',

  /** @param {unknown} _ctx */
  render: async (_ctx) => '<div class="widget-card"></div>',

  /** @param {HTMLElement} _el @param {unknown} _ctx */
  afterRender: (_el, _ctx) => {},

  /** @param {HTMLElement} _el */
  destroy: (_el) => {},
};



// =============================================================================
// FILE: avg-rate.widget.js
// =============================================================================

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



// =============================================================================
// FILE: best-day.widget.js
// =============================================================================

import { t }   from '../../utils/strings.js';
import { esc } from './esc.js';

const _IC_CAL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`;

const DOW_LABELS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
// Relative heights for a visually-weighted bar (not real earnings data —
// just a decorative scaffold; adjust if per-day earnings are available in ctx)
const DOW_HEIGHTS = [55, 70, 75, 80, 90, 100, 65]; // % heights, Fri is peak shape

export default {
  id: 'bestDay',
  label: 'Best Day',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'analytics',

  render: async (ctx) => {
    const c   = /** @type {any} */ (ctx);
    const day = Number(c?.data?.bestDay?.day ?? -1);
    const label = day >= 0 && day <= 6 ? DOW_LABELS[day] : '—';

    const bars = DOW_LABELS.map((d, i) => {
      const isActive = i === day;
      const h = DOW_HEIGHTS[i];
      return `
        <div class="wdow-d">
          <div class="wdow-b${isActive ? ' act' : ''}" style="height:${h}%"></div>
          <span class="wdow-l${isActive ? ' act' : ''}">${d.slice(0,1)}</span>
        </div>`;
    }).join('');

    return `
      <div class="wr">
        <div class="wh">
          <div class="wi">${_IC_CAL}</div>
          <span class="wl">${esc(t('analytics.bestDay'))}</span>
          <span class="wb acc">${esc(label)}</span>
        </div>
        <div class="wv" style="font-size:clamp(18px,3vw,24px)">${esc(label)}</div>
        <div class="wdow" style="flex:1;padding-top:4px">${bars}</div>
      </div>`;
  },
  afterRender: (_el, _ctx) => {},
  destroy:     (_el)       => {},
};



// =============================================================================
// FILE: best-hour.widget.js
// =============================================================================

import { t } from '../../utils/strings.js';
import { esc } from './esc.js';

export default {
  id: 'bestHour',
  label: 'Best Hour',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'analytics',

  /** @param {unknown} ctx */
  render: async (ctx) => {
    // Safe extraction
    const c = /** @type {{ data?: { bestHour?: { hour?: number } } }} */ (ctx);
    const hour = Number(c?.data?.bestHour?.hour ?? -1);
    
    const isValid = hour >= 0 && hour <= 23;
    
    // Time Formatting Logic
    let primaryTime = '—';
    let ampm = '';
    let windowText = 'Awaiting data';

    if (isValid) {
      const isPM = hour >= 12;
      ampm = isPM ? 'PM' : 'AM';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      
      const nextHour = (hour + 1) % 24;
      const nextIsPM = nextHour >= 12;
      const nextAmpm = nextIsPM ? 'PM' : 'AM';
      const displayNextHour = nextHour % 12 === 0 ? 12 : nextHour % 12;

      primaryTime = `${displayHour}:00`;
      windowText = `${displayHour}:00 ${ampm} – ${displayNextHour}:00 ${nextAmpm}`;
    }

    const labelText = t('analytics.bestHour') || 'Peak Earning Hour';

    // Generate the 24 little bars for the timeline infographic
    let timelineHTML = '';
    for (let i = 0; i < 24; i++) {
      let barClass = 'bh-tick';
      let delay = i * 0.03; // Staggered animation delay
      
      if (isValid && i === hour) {
        barClass += ' bh-tick-active';
      } else if (isValid && (i === hour - 1 || i === hour + 1)) {
        // Create a slight visual "shoulder" around the peak hour
        barClass += ' bh-tick-shoulder';
      }
      
      timelineHTML += `<div class="${barClass}" style="animation-delay: ${delay}s;"></div>`;
    }

    const scopedStyles = `
      <style>
        /* Fade and slide in for the bars */
        @keyframes tickIntro {
          0% { transform: scaleY(0.1); opacity: 0; }
          100% { transform: scaleY(1); opacity: 1; }
        }
        
        /* Continuous subtle pulse for the peak hour */
        @keyframes peakPulse {
          0%, 100% { opacity: 1; box-shadow: 0 0 8px color-mix(in srgb, var(--widget-accent) 60%, transparent); }
          50% { opacity: 0.7; box-shadow: 0 0 2px color-mix(in srgb, var(--widget-accent) 20%, transparent); }
        }

        .bh-container { display: flex; flex-direction: column; height: 100%; justify-content: space-between; padding: 4px; }
        
        .bh-header { display: flex; align-items: center; gap: 10px; }
        .bh-icon-wrapper {
          display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; 
          border-radius: 8px; background: color-mix(in srgb, var(--widget-accent, #8b5cf6) 15%, transparent); 
          color: var(--widget-accent, #8b5cf6);
        }

        .bh-main-content { margin-top: 12px; display: flex; flex-direction: column; }
        
        .bh-time-wrapper { display: flex; align-items: baseline; gap: 6px; }
        .bh-main-time { font-size: 2.25rem; font-weight: 800; line-height: 1.1; letter-spacing: -0.03em; color: var(--color-text-main); }
        .bh-ampm { font-size: 1.1rem; font-weight: 800; color: var(--widget-accent, #8b5cf6); }
        
        .bh-window-text { font-size: 0.75rem; font-weight: 700; color: var(--color-text-muted, #888); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.05em; }

        /* Timeline Visualizer */
        .bh-timeline-wrap { margin-top: auto; padding-top: 16px; }
        .bh-timeline { display: flex; align-items: flex-end; justify-content: space-between; height: 28px; gap: 2px; }
        
        .bh-tick { 
          flex: 1; 
          background: var(--color-surface-raised, rgba(150, 150, 150, 0.2)); 
          border-radius: 2px; 
          height: 15%; 
          transform-origin: bottom;
          opacity: 0;
          animation: tickIntro 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        
        .bh-tick-shoulder {
          height: 40%;
          background: color-mix(in srgb, var(--widget-accent, #8b5cf6) 40%, var(--color-surface-raised));
        }

        .bh-tick-active {
          height: 100%;
          background: var(--widget-accent, #8b5cf6);
          animation: tickIntro 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards, peakPulse 2s infinite 1s;
        }
      </style>
    `;

    return `
      ${scopedStyles}
      <div class="bh-container">
        
        <!-- Header -->
        <div class="bh-header">
          <div class="bh-icon-wrapper">
            <!-- Clock / Star icon indicating 'Best' time -->
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 10"></polyline>
              <path d="M19 4l-2 2"></path>
              <path d="M21 7l-2-1"></path>
            </svg>
          </div>
          <span class="stat-label">${esc(labelText)}</span>
        </div>

        <!-- Typography -->
        <div class="bh-main-content">
          <div class="bh-time-wrapper">
            <span class="bh-main-time">${esc(primaryTime)}</span>
            ${isValid ? `<span class="bh-ampm">${esc(ampm)}</span>` : ''}
          </div>
          <span class="bh-window-text">${esc(windowText)}</span>
        </div>

        <!-- 24-Hour Timeline Visualizer -->
        <div class="bh-timeline-wrap">
          <div class="bh-timeline">
            ${timelineHTML}
          </div>
        </div>

      </div>
    `;
  },
  
  afterRender: (_el, _ctx) => {},
  destroy: (_el) => {},
};



// =============================================================================
// FILE: dead-miles.widget.js
// =============================================================================

import { t }   from '../../utils/strings.js';
import { esc } from './esc.js';

const _IC_MAP = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`;

export default {
  id: 'deadMiles',
  label: 'Dead Miles',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'analytics',

  render: async (ctx) => {
    const c      = /** @type {any} */ (ctx);
    const ratio  = Number(c?.data?.deadMiles?.ratio)  || 0;
    const deadKm = Number(c?.data?.deadMiles?.deadKm) || 0;
    const pct    = (ratio * 100).toFixed(1);
    const badge  = ratio > 0.25 ? 'neg' : ratio > 0.15 ? 'warn' : 'pos';
    const label  = ratio > 0.25 ? 'High' : ratio > 0.15 ? 'Moderate' : 'Low';

    return `
      <div class="wr">
        <div class="wh">
          <div class="wi">${_IC_MAP}</div>
          <span class="wl">${esc(t('analytics.deadMilesSummary'))}</span>
          <span class="wb ${badge}">${esc(label)}</span>
        </div>
        <div class="wv">${esc(pct)}<span class="unit">%</span></div>
        <div class="wdm">
          <div class="wdm-dead" style="width:${Math.min(100, ratio*100).toFixed(1)}%"></div>
        </div>
        <div class="wf">
          <span class="ws">${esc(deadKm.toFixed(1))} km unpaid</span>
          <span class="ws">${esc((100 - ratio*100).toFixed(1))}% earning</span>
        </div>
      </div>`;
  },
  afterRender: (_el, _ctx) => {},
  destroy:     (_el)       => {},
};



// =============================================================================
// FILE: deliveries.widget.js
// =============================================================================

import { formatLargeNumber } from '../../utils/formatters.js';
import { t } from '../../utils/strings.js';
import { esc } from './esc.js';

export default {
  id: 'deliveries',
  label: 'Deliveries',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'financial',

  /** @param {unknown} ctx */
  render: async (ctx) => {
    // Safely extract the orders data, defaulting to 0
    const c = /** @type {{ data?: { financial?: { orders?: number } } }} */ (ctx);
    const n = Math.round(Number(c?.data?.financial?.orders) || 0);
    
    // Formatting the number and grabbing translations
    const formattedDeliveries = formatLargeNumber(n);
    const labelText = t('views.dashboard.financial.deliveries') || 'Deliveries';

    const scopedStyles = `
      <style>
        /* Fade and slide up for the main number */
        @keyframes dlvFadeUp {
          0% { opacity: 0; transform: translateY(6px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        /* The moving delivery dot animation */
        @keyframes dlvRouteDrive {
          0% { left: 0%; opacity: 0; transform: scale(0.5); }
          15% { opacity: 1; transform: scale(1); }
          85% { opacity: 1; transform: scale(1); }
          100% { left: calc(100% - 8px); opacity: 0; transform: scale(0.5); }
        }

        .dlv-container { 
          display: flex; 
          flex-direction: column; 
          height: 100%; 
          justify-content: space-between; 
          padding: 4px; 
        }
        
        .dlv-header { 
          display: flex; 
          align-items: center; 
          gap: 10px; 
        }
        
        .dlv-icon-wrapper {
          display: flex; 
          align-items: center; 
          justify-content: center; 
          width: 32px; 
          height: 32px; 
          border-radius: 8px; 
          background: color-mix(in srgb, var(--widget-accent, #3b82f6) 15%, transparent); 
          color: var(--widget-accent, #3b82f6);
        }

        .dlv-body { 
          margin-top: 12px; 
          animation: dlvFadeUp 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        
        .dlv-main-value { 
          font-size: 2.25rem; 
          font-weight: 800; 
          line-height: 1.1; 
          letter-spacing: -0.03em; 
          color: var(--color-text-main); 
          font-variant-numeric: tabular-nums;
        }
        
        .dlv-subtext { 
          font-size: 0.7rem; 
          font-weight: 700; 
          color: var(--color-text-muted, #888); 
          margin-top: 6px; 
          text-transform: uppercase; 
          letter-spacing: 0.08em; 
          opacity: 0.8; 
        }

        /* Animated logistics visualizer */
        .dlv-route-wrap { 
          position: relative; 
          height: 16px; 
          display: flex; 
          align-items: center; 
          margin-top: auto; 
          padding-top: 16px; 
        }
        
        /* Dashed track background */
        .dlv-route-track { 
          width: 100%; 
          height: 2px; 
          background-image: linear-gradient(to right, var(--color-surface-raised, rgba(150, 150, 150, 0.3)) 50%, transparent 50%); 
          background-size: 8px 100%; 
          border-radius: 2px;
        }
        
        /* The moving delivery indicator */
        .dlv-route-dot { 
          position: absolute; 
          width: 8px; 
          height: 8px; 
          background: var(--widget-accent, #3b82f6); 
          border-radius: 50%; 
          top: 50%;
          margin-top: -4px; /* Centers dot vertically on the line */
          box-shadow: 0 0 8px color-mix(in srgb, var(--widget-accent, #3b82f6) 60%, transparent); 
          animation: dlvRouteDrive 3s infinite linear; 
        }
        
        /* Map pin markers at start and end */
        .dlv-route-pin {
          position: absolute;
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: var(--color-surface-raised, rgba(150, 150, 150, 0.8));
          top: 50%;
          margin-top: -2px;
        }
        .dlv-route-pin.start { left: 0; }
        .dlv-route-pin.end { right: 0; }
      </style>
    `;

    return `
      ${scopedStyles}
      <div class="dlv-container">
        
        <!-- Header -->
        <div class="dlv-header">
          <div class="dlv-icon-wrapper">
            <!-- Isometric Box / Package Icon -->
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
              <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
              <line x1="12" y1="22.08" x2="12" y2="12"></line>
            </svg>
          </div>
          <span class="stat-label">${esc(labelText)}</span>
        </div>

        <!-- Typography -->
        <div class="dlv-body">
          <div class="dlv-main-value">
            ${esc(formattedDeliveries)}
          </div>
          <div class="dlv-subtext">
            Completed Orders
          </div>
        </div>

        <!-- Logistics Route Visualizer -->
        <div class="dlv-route-wrap">
          <div class="dlv-route-track"></div>
          <div class="dlv-route-pin start"></div>
          <div class="dlv-route-pin end"></div>
          <div class="dlv-route-dot"></div>
        </div>

      </div>
    `;
  },
  
  afterRender: (_el, _ctx) => {},
  destroy: (_el) => {},
};



// =============================================================================
// FILE: earnings.widget.js
// =============================================================================

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



// =============================================================================
// FILE: effective-rate.widget.js
// =============================================================================

import { formatCurrency } from '../../utils/formatters.js';
import { t }              from '../../utils/strings.js';
import { esc }            from './esc.js';

const _IC_ZAP = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`;

export default {
  id: 'effectiveRate',
  label: 'Effective $/hr',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'financial',

  render: async (ctx) => {
    const c        = /** @type {any} */ (ctx);
    const val      = Number(c?.data?.financial?.effectivePerHr) || 0;
    const avg      = Number(c?.data?.financial?.avgRateHr)      || 0;
    const country  = String(c?.data?.localeCountry || 'US');
    const currency = String(c?.data?.currency      || 'USD');

    // Compare effective vs gross rate
    const delta  = avg > 0 ? val - avg : null;
    const subText = delta !== null
      ? `${delta >= 0 ? '+' : ''}${formatCurrency(delta, country, { currency })} vs gross rate`
      : 'after expenses';

    return `
      <div class="wr">
        <div class="wh">
          <div class="wi">${_IC_ZAP}</div>
          <span class="wl">${esc(t('views.dashboard.financial.effectivePerHr'))}</span>
          <span class="wb ${delta !== null && delta >= 0 ? 'pos' : 'neg'}">after costs</span>
        </div>
        <div class="wv" style="color:var(--wa)">${esc(formatCurrency(val, country, { currency }))}</div>
        <div class="ws">${esc(subText)}</div>
      </div>`;
  },
  afterRender: (_el, _ctx) => {},
  destroy:     (_el)       => {},
};



// =============================================================================
// FILE: expenses.widget.js
// =============================================================================

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



// =============================================================================
// FILE: income-breakdown.widget.js
// =============================================================================

import { t }                      from '../../utils/strings.js';
import { esc }                    from './esc.js';
import { renderIncomeSourceChart } from '../../modules/analytics/analytics-charts.js';

const _IC_PIE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.21 15.89A10 10 0 1 1 8 2.83"/><path d="M22 12A10 10 0 0 0 12 2v10z"/></svg>`;

export default {
  id: 'incomeBreakdown',
  label: 'Income Breakdown',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'analytics',

  render: async (ctx) => {
    const c        = /** @type {any} */ (ctx);
    const gross    = Number(c?.data?.financial?.gross) || 0;
    const tips     = Number(c?.data?.financial?.tips)  || 0;
    const bonus    = Number(c?.data?.financial?.bonus) || 0;
    const base     = Math.max(0, gross - tips - bonus);
    const tipsPct  = gross > 0 ? Math.round((tips / gross)  * 100) : 0;
    const bonusPct = gross > 0 ? Math.round((bonus / gross) * 100) : 0;

    return `
      <div class="wr">
        <div class="wh">
          <div class="wi">${_IC_PIE}</div>
          <span class="wl">${esc(t('analytics.incomeBreakdown'))}</span>
          ${tipsPct > 0 ? `<span class="wb pos">${tipsPct}% tips</span>` : ''}
        </div>
        <div class="wch" style="min-height:100px">
          <canvas data-widget-chart="incomeBreakdown"></canvas>
        </div>
        <div class="wss">
          <div class="wsc">
            <span class="wscl">Base</span>
            <span class="wscv">${Math.round((base/Math.max(gross,1))*100)}%</span>
          </div>
          <div class="wsc">
            <span class="wscl">Tips</span>
            <span class="wscv pos">${tipsPct}%</span>
          </div>
          ${bonusPct > 0 ? `<div class="wsc"><span class="wscl">Bonus</span><span class="wscv acc">${bonusPct}%</span></div>` : ''}
        </div>
      </div>`;
  },

  afterRender: (el, ctx) => {
    const c      = /** @type {any} */ (ctx);
    const canvas = el.querySelector('canvas[data-widget-chart="incomeBreakdown"]');
    if (canvas instanceof HTMLCanvasElement && c?.data?.financial) {
      const { gross, tips, bonus } = c.data.financial;
      const base = Math.max(0, gross - tips - bonus);
      renderIncomeSourceChart(canvas, { base, tips, bonus });
    }
  },
  destroy: (_el) => {},
};



// =============================================================================
// FILE: month-gross.widget.js
// =============================================================================

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



// =============================================================================
// FILE: month-hourly.widget.js
// =============================================================================

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



// =============================================================================
// FILE: month-orders.widget.js
// =============================================================================

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



// =============================================================================
// FILE: net-income.widget.js
// =============================================================================

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



// =============================================================================
// FILE: out-of-pocket.widget.js
// =============================================================================

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



// =============================================================================
// FILE: per-delivery.widget.js
// =============================================================================

import { formatCurrency } from '../../utils/formatters.js';
import { t }              from '../../utils/strings.js';
import { esc }            from './esc.js';

const _IC_TRUCK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>`;

export default {
  id: 'perDelivery',
  label: 'Per Delivery',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'financial',

  render: async (ctx) => {
    const c        = /** @type {any} */ (ctx);
    const val      = Number(c?.data?.financial?.perDelivery) || 0;
    const country  = String(c?.data?.localeCountry || 'US');
    const currency = String(c?.data?.currency      || 'USD');
    const orders   = Number(c?.data?.financial?.orders)  || 0;
    const sub      = orders > 0 ? `across ${orders} deliveries` : 'avg per delivery';

    return `
      <div class="wr">
        <div class="wh">
          <div class="wi">${_IC_TRUCK}</div>
          <span class="wl">${esc(t('views.dashboard.financial.perDelivery'))}</span>
          <span class="wb acc">avg</span>
        </div>
        <div class="wv" style="color:var(--wa)">${esc(formatCurrency(val, country, { currency }))}</div>
        <div class="ws">${esc(sub)}</div>
      </div>`;
  },
  afterRender: (_el, _ctx) => {},
  destroy:     (_el)       => {},
};



// =============================================================================
// FILE: placeholder.widget.js
// =============================================================================

export default {
  id: 'placeholder',
  label: 'Placeholder',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'misc',
  render:      async (_ctx)      => '<div class="widget-card" data-registry-widget="placeholder"></div>',
  afterRender: (_el, _ctx)       => {},
  destroy:     (_el)             => {},
};



// =============================================================================
// FILE: platform-activity.widget.js
// =============================================================================

import { t } from '../../utils/strings.js';
import { esc } from './esc.js';
import { formatCurrency } from '../../utils/formatters.js';

const _IC_PLATFORMS = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg>`;

export default {
  id: 'platformActivity',
  label: 'Platform Mix',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'analytics',

  /** @param {unknown} ctx */
  render: async (ctx) => {
    const c = /** @type {{ data?: { platformActivity?: { month: string, dominantPlatform: string, platforms: { platformId: string, gross: number }[] }[] }; localeCountry?: string; currency?: string }} */ (ctx);
    const activity = c?.data?.platformActivity || [];
    const latest = activity.length > 0 ? activity[activity.length - 1] : null;

    if (!latest || !latest.platforms || latest.platforms.length === 0) {
      return `
        <div class="wr pa-empty">
          <div class="wh">
            <div class="wi">${_IC_PLATFORMS}</div>
            <span class="wl">${esc(t('analytics.platformMix'))}</span>
          </div>
          <div class="pa-empty-body">
            <p>${esc(t('analytics.noData'))}</p>
          </div>
        </div>
      `;
    }

    const totalGross = latest.platforms.reduce((sum, p) => sum + p.gross, 0) || 1;
    const sortedPlatforms = [...latest.platforms].sort((a, b) => b.gross - a.gross);
    const dominant = sortedPlatforms[0];

    const country = String(c?.localeCountry || 'US');
    const currency = String(c?.currency || 'USD');

    const scopedStyles = `
      <style>
        .pa-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          gap: 12px;
        }
        .pa-bar {
          display: flex;
          height: 12px;
          border-radius: 6px;
          overflow: hidden;
          background: var(--color-surface-raised);
          width: 100%;
        }
        .pa-segment {
          height: 100%;
          transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        .pa-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
          flex: 1;
          overflow-y: auto;
        }
        .pa-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.75rem;
        }
        .pa-item-info {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
        }
        .pa-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .pa-name {
          font-weight: 700;
          color: var(--color-text-main);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          text-transform: capitalize;
        }
        .pa-val {
          font-weight: 800;
          font-variant-numeric: tabular-nums;
          color: var(--color-text-secondary);
        }
        .pa-dominant-badge {
          font-size: 10px;
          font-weight: 800;
          text-transform: uppercase;
          background: color-mix(in srgb, var(--color-success) 15%, transparent);
          color: var(--color-success);
          padding: 2px 6px;
          border-radius: 4px;
          letter-spacing: 0.02em;
        }
      </style>
    `;

    const segments = sortedPlatforms.map(p => {
      const pct = (p.gross / totalGross) * 100;
      const color = `var(--color-${p.platformId}, var(--color-other))`;
      return `<div class="pa-segment" style="width: ${pct}%; background-color: ${color};" title="${esc(p.platformId)}: ${Math.round(pct)}%"></div>`;
    }).join('');

    const listItems = sortedPlatforms.map(p => {
      const color = `var(--color-${p.platformId}, var(--color-other))`;
      return `
        <div class="pa-item">
          <div class="pa-item-info">
            <div class="pa-dot" style="background-color: ${color};"></div>
            <span class="pa-name">${esc(p.platformId)}</span>
          </div>
          <span class="pa-val">${formatCurrency(p.gross / 100, country, { currency })}</span>
        </div>
      `;
    }).join('');

    return `
      ${scopedStyles}
      <div class="wr">
        <div class="wh">
          <div class="wi">${_IC_PLATFORMS}</div>
          <span class="wl">${esc(t('analytics.platformMix'))}</span>
          ${dominant ? `<div class="pa-dominant-badge">${esc(dominant.platformId)}</div>` : ''}
        </div>
        <div class="pa-container">
          <div class="pa-bar">
            ${segments}
          </div>
          <div class="pa-list">
            ${listItems}
          </div>
        </div>
      </div>
    `;
  },

  afterRender: (_el, _ctx) => {
    // No Chart.js needed now, CSS transitions handle the bar width
  },

  destroy: (_el) => {},
};



// =============================================================================
// FILE: recent-shifts.widget.js
// =============================================================================

import { t } from '../../utils/strings.js';
import { esc } from './esc.js';
import { getRecentActivity } from '../../modules/analytics/analytics.js';
import { formatCurrency } from '../../utils/formatters.js';

const _IC_CLOCK = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;

export default {
  id: 'recentShifts',
  label: 'Recent Activity',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'analytics',

  /** @param {unknown} ctx */
  render: async (ctx) => {
    const c = /** @type {{ localeCountry?: string, currency?: string }} */ (ctx);
    const activity = await getRecentActivity(4);
    const country = String(c?.localeCountry || 'US');
    const currency = String(c?.currency || 'USD');

    const scopedStyles = `
      <style>
        .rs-container { display: flex; flex-direction: column; height: 100%; gap: 10px; padding: 2px; }
        .rs-list { display: flex; flex-direction: column; gap: 8px; flex: 1; overflow: hidden; }
        .rs-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 6px 8px;
          border-radius: 8px;
          background: var(--color-surface-raised);
          font-size: 0.75rem;
          transition: transform 0.2s;
        }
        .rs-item:hover { transform: translateX(4px); }
        .rs-item-left { display: flex; align-items: center; gap: 8px; min-width: 0; }
        .rs-dot { width: 6px; height: 6px; border-radius: 50%; flex-shrink: 0; }
        .rs-date { font-weight: 700; color: var(--color-text-main); white-space: nowrap; }
        .rs-meta { font-size: 0.65rem; color: var(--color-text-muted); font-weight: 600; text-transform: uppercase; }
        .rs-gross { font-weight: 800; color: var(--color-text-main); font-variant-numeric: tabular-nums; }
        .rs-empty { 
          display: flex; flex-direction: column; align-items: center; justify-content: center; 
          height: 100%; color: var(--color-text-muted); font-size: 0.7rem; font-weight: 600; 
          text-transform: uppercase; letter-spacing: 0.05em; opacity: 0.6;
        }
      </style>
    `;

    if (!activity.length) {
      return `
        ${scopedStyles}
        <div class="wr">
          <div class="wh">
            <div class="wi">${_IC_CLOCK}</div>
            <span class="wl">Recent Activity</span>
          </div>
          <div class="rs-empty">No shifts logged yet</div>
        </div>
      `;
    }

    const listItems = activity.map(s => {
      const color = `var(--color-${s.platformId}, var(--color-other))`;
      // Format date to "May 12"
      const d = new Date(`${s.date}T12:00:00`);
      const fmtDate = d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
      
      return `
        <div class="rs-item">
          <div class="rs-item-left">
            <div class="rs-dot" style="background-color: ${color};"></div>
            <div style="display:flex; flex-direction:column;">
              <span class="rs-date">${esc(fmtDate)}</span>
              <span class="rs-meta">${esc(s.platformId)}</span>
            </div>
          </div>
          <span class="rs-gross">${esc(formatCurrency(s.gross, country, { currency }))}</span>
        </div>
      `;
    }).join('');

    return `
      ${scopedStyles}
      <div class="wr">
        <div class="wh" style="margin-bottom: 8px;">
          <div class="wi">${_IC_CLOCK}</div>
          <span class="wl">Recent Activity</span>
          <span class="wb">History</span>
        </div>
        <div class="rs-list">
          ${listItems}
        </div>
      </div>
    `;
  },

  afterRender: (_el, _ctx) => {},
  destroy: (_el) => {},
};



// =============================================================================
// FILE: rolling-trend.widget.js
// =============================================================================

import { formatCurrency } from '../../utils/formatters.js';
import { t } from '../../utils/strings.js';
import { esc } from './esc.js';

/**
 * Calculates linear regression to determine the trend slope over the 30 days.
 * @param {Array<{x: number, y: number}>} points 
 */
function getTrendStats(points) {
  if (!points || points.length < 2) return { m: 0, b: 0, isUp: false };
  const n = points.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0;
  
  for (let i = 0; i < n; i++) {
    const { x, y } = points[i];
    sumX += x; sumY += y;
    sumXY += (x * y); sumX2 += (x * x);
  }
  
  const m = ((n * sumXY) - (sumX * sumY)) / ((n * sumX2) - (sumX * sumX));
  const b = (sumY - m * sumX) / n;
  
  return { m, b, isUp: m > 0 };
}

export default {
  id: 'rollingTrend',
  label: '30-Day Trend',
  defaultSize: '2x1',
  defaultVisible: false,
  category: 'analytics',

  /** @param {unknown} ctx */
  render: async (ctx) => {
    const c = /** @type {{ data?: { rollingTrend?: { points: {x:number, y:number}[] }; localeCountry?: string; currency?: string } }} */ (ctx);
    const rawPoints = c?.data?.rollingTrend?.points || [];
    
    const country = String(c?.data?.localeCountry || 'US');
    const currency = String(c?.data?.currency || 'USD');

    const labelText = t('analytics.trends') || '30-Day Trend';

    // Empty State Fallback
    if (rawPoints.length < 2) {
      return `
        <div style="display:flex; flex-direction:column; height:100%; justify-content:center; align-items:center; color:var(--color-text-muted);">
          <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin-bottom:8px; opacity:0.5;">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
          <span style="font-size:0.8rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">Awaiting Trend Data</span>
        </div>
      `;
    }

    // --- Statistical Analysis ---
    const values = rawPoints.map(p => p.y);
    const maxY = Math.max(...values);
    const minY = Math.min(...values);
    const avgY = values.reduce((a, b) => a + b, 0) / values.length;
    
    // Add 10% padding to top and bottom for visual breathing room in the SVG
    const range = (maxY - minY) || 1; 
    const svgMaxY = maxY + (range * 0.1);
    const svgMinY = Math.max(0, minY - (range * 0.1)); 
    const svgRange = svgMaxY - svgMinY;

    const trend = getTrendStats(rawPoints);
    const trendLabel = trend.isUp ? 'Trending Up' : 'Cooling Down';
    const trendColor = trend.isUp ? 'var(--color-success, #10b981)' : 'var(--color-danger, #f43f5e)';
    const trendIcon = trend.isUp 
      ? `<polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline>`
      : `<polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline><polyline points="17 18 23 18 23 12"></polyline>`;

    // --- SVG Canvas Setup (800x200 for crisp 2x1 grid scaling) ---
    const svgW = 800;
    const svgH = 200;

    // Generate Path Data for the Trendline
    const pointsMapped = rawPoints.map((p, i) => {
      const x = (i / (rawPoints.length - 1)) * svgW;
      const y = svgH - ((p.y - svgMinY) / svgRange) * svgH;
      return { x, y, rawX: p.x, rawY: p.y };
    });

    const pathData = `M ${pointsMapped.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' L ')}`;
    // Close the path for the area gradient underneath
    const areaData = `${pathData} L ${svgW},${svgH} L 0,${svgH} Z`;

    // Map the Average Line
    const avgYMapped = svgH - ((avgY - svgMinY) / svgRange) * svgH;

    // Generate Interaction Hitboxes for the Tooltip Scrubber
    const hitboxesHTML = pointsMapped.map((p, i) => {
      // Create vertical bands across the width of the chart
      const width = svgW / (pointsMapped.length - 1 || 1);
      const startX = p.x - (width / 2);
      return `<rect class="rt-hitbox" x="${startX}" y="0" width="${width}" height="${svgH}" 
                data-idx="${i}" data-cx="${p.x}" data-cy="${p.y}" 
                data-rawx="${p.rawX + 1}" data-rawy="${p.rawY}"></rect>`;
    }).join('');

    const scopedStyles = `
      <style>
        @keyframes drawLine {
          from { stroke-dashoffset: 1500; opacity: 0; }
          to { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes fadeArea {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .rt-container { display: flex; flex-direction: column; height: 100%; position: relative; padding: 4px; }
        
        .rt-header-row { display: flex; justify-content: space-between; align-items: flex-start; z-index: 2; position: relative; }
        
        .rt-title-group { display: flex; align-items: center; gap: 10px; }
        .rt-icon-wrap {
          display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; 
          border-radius: 8px; background: color-mix(in srgb, var(--widget-accent, #8b5cf6) 15%, transparent); 
          color: var(--widget-accent, #8b5cf6);
        }

        .rt-stats-group { text-align: right; }
        .rt-stat-pill {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em;
          color: ${trendColor}; background: color-mix(in srgb, ${trendColor} 10%, transparent);
          padding: 4px 8px; border-radius: 999px;
          border: 1px solid color-mix(in srgb, ${trendColor} 30%, transparent);
        }
        .rt-stat-sub { font-size: 0.65rem; font-weight: 700; color: var(--color-text-muted, #888); margin-top: 4px; letter-spacing: 0.05em; display: flex; justify-content: flex-end; gap: 8px;}
        .rt-highlight { color: var(--color-text-main); font-weight: 800; font-variant-numeric: tabular-nums;}

        /* Canvas / SVG Wrapping */
        .rt-chart-wrap { flex-grow: 1; position: relative; width: 100%; min-height: 100px; margin-top: 16px; overflow: hidden; }
        .rt-svg { width: 100%; height: 100%; overflow: visible; display: block; }
        
        /* Grid and Averages */
        .rt-grid-line { stroke: var(--color-text-muted); opacity: 0.15; stroke-width: 1; stroke-dasharray: 4 4; }
        .rt-avg-text { fill: var(--color-text-muted); font-size: 12px; font-weight: 700; opacity: 0.6; }
        
        /* Trend Paths */
        .rt-area { fill: url(#rt-grad); opacity: 0; animation: fadeArea 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) 0.3s forwards; }
        .rt-line { 
          fill: none; stroke: var(--widget-accent, #8b5cf6); stroke-width: 3; stroke-linejoin: round; stroke-linecap: round;
          stroke-dasharray: 1500; stroke-dashoffset: 1500;
          animation: drawLine 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        /* Interaction Elements */
        .rt-hitbox { fill: transparent; cursor: crosshair; }
        .rt-hover-line { stroke: var(--color-text-muted); stroke-width: 1; opacity: 0; stroke-dasharray: 4 4; pointer-events: none; transition: opacity 0.1s; }
        .rt-hover-dot { fill: var(--color-surface-main, #fff); stroke: var(--widget-accent); stroke-width: 3; r: 5; opacity: 0; pointer-events: none; transition: opacity 0.1s, cx 0.05s, cy 0.05s; filter: drop-shadow(0 0 4px var(--widget-accent)); }
        
        /* Dynamic CSS Tooltip */
        .rt-tooltip {
          position: absolute; pointer-events: none; opacity: 0;
          background: var(--color-surface-raised, #222);
          border: 1px solid color-mix(in srgb, var(--widget-accent) 40%, transparent);
          box-shadow: 0 8px 16px rgba(0,0,0,0.4);
          padding: 6px 12px; border-radius: 8px;
          transform: translate(-50%, -130%);
          transition: opacity 0.15s, top 0.05s, left 0.05s;
          z-index: 100; backdrop-filter: blur(8px);
          display: flex; flex-direction: column; gap: 2px; align-items: center;
        }
        .rt-tt-val { font-size: 1.1rem; font-weight: 800; color: var(--widget-accent); font-variant-numeric: tabular-nums; }
        .rt-tt-day { font-size: 0.65rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
      </style>
    `;

    return `
      ${scopedStyles}
      <div class="rt-container" id="rt-container-${ctx?.id || 'main'}">
        
        <!-- Header & Stats -->
        <div class="rt-header-row">
          <div class="rt-title-group">
            <div class="rt-icon-wrap">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
              </svg>
            </div>
            <div style="display:flex; flex-direction:column;">
              <span class="stat-label">${esc(labelText)}</span>
              <span style="font-size:0.65rem; font-weight:700; color:var(--color-text-muted); margin-top:2px;">
                Rolling Timeline
              </span>
            </div>
          </div>

          <!-- Computed Intelligence Insights -->
          <div class="rt-stats-group">
            <div class="rt-stat-pill">
              <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                ${trendIcon}
              </svg>
              ${esc(trendLabel)}
            </div>
            <div class="rt-stat-sub">
              <span>Avg: <span class="rt-highlight">${formatCurrency(avgY, country, {currency})}</span></span>
              <span>Peak: <span class="rt-highlight">${formatCurrency(maxY, country, {currency})}</span></span>
            </div>
          </div>
        </div>

        <!-- The SVG Data Visualizer -->
        <div class="rt-chart-wrap" id="rt-wrap-${ctx?.id || 'main'}">
          <!-- Floating Tooltip -->
          <div class="rt-tooltip" id="rt-tt-${ctx?.id || 'main'}"></div>

          <svg class="rt-svg" viewBox="0 0 ${svgW} ${svgH}" preserveAspectRatio="none">
            <defs>
              <linearGradient id="rt-grad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="var(--widget-accent)" stop-opacity="0.3"/>
                <stop offset="100%" stop-color="var(--widget-accent)" stop-opacity="0.0"/>
              </linearGradient>
            </defs>

            <!-- Base Grid & Average Line -->
            <line class="rt-grid-line" x1="0" y1="${svgH}" x2="${svgW}" y2="${svgH}"></line>
            <line class="rt-grid-line" x1="0" y1="${avgYMapped}" x2="${svgW}" y2="${avgYMapped}"></line>
            
            <!-- Trend Data -->
            <path class="rt-area" d="${areaData}"></path>
            <path class="rt-line" d="${pathData}"></path>

            <!-- Hover Interaction Overlay Elements -->
            <line class="rt-hover-line" id="rt-hline-${ctx?.id || 'main'}" x1="0" y1="0" x2="0" y2="${svgH}"></line>
            <circle class="rt-hover-dot" id="rt-hdot-${ctx?.id || 'main'}" cx="0" cy="0"></circle>

            <!-- Invisible Hitboxes for accurate mouse tracking -->
            ${hitboxesHTML}
          </svg>
        </div>

      </div>
    `;
  },
  
  /** 
   * @param {HTMLElement} el 
   * @param {unknown} ctx 
   */
  afterRender: (el, ctx) => {
    const wrap = el.querySelector('.rt-chart-wrap');
    const tooltip = /** @type {HTMLElement} */ (el.querySelector('.rt-tooltip'));
    const hoverLine = el.querySelector('.rt-hover-line');
    const hoverDot = el.querySelector('.rt-hover-dot');
    const hitboxes = el.querySelectorAll('.rt-hitbox');
    
    if (!wrap || !tooltip || !hoverLine || !hoverDot) return;

    const c = /** @type {{ localeCountry?: string; currency?: string }} */ (ctx);
    const country = String(c?.localeCountry || 'US');
    const currency = String(c?.currency || 'USD');

    hitboxes.forEach(box => {
      box.addEventListener('mouseenter', (e) => {
        const target = /** @type {SVGRectElement} */ (e.target);
        
        // Extract data
        const cx = target.getAttribute('data-cx');
        const cy = target.getAttribute('data-cy');
        const rawY = parseFloat(target.getAttribute('data-rawy') || '0');
        const rawX = target.getAttribute('data-rawx'); // Day X

        // Format tooltip
        tooltip.innerHTML = `
          <span class="rt-tt-val">${formatCurrency(rawY, country, {currency})}</span>
          <span class="rt-tt-day">Day ${rawX}</span>
        `;

        // Move SVG Indicator elements
        hoverDot.setAttribute('cx', cx || '0');
        hoverDot.setAttribute('cy', cy || '0');
        /** @type {HTMLElement} */ (hoverDot).style.opacity = '1';

        hoverLine.setAttribute('x1', cx || '0');
        hoverLine.setAttribute('x2', cx || '0');
        /** @type {HTMLElement} */ (hoverLine).style.opacity = '1';

        // Calculate HTML Tooltip position relative to wrapper container
        const wrapRect = wrap.getBoundingClientRect();
        
        // Convert SVG coordinates to physical pixel coordinates 
        // (because SVG is preserveAspectRatio="none", cx is a percentage of 800)
        const percentX = parseFloat(cx || '0') / 800;
        const percentY = parseFloat(cy || '0') / 200;
        
        const pxX = percentX * wrapRect.width;
        const pxY = percentY * wrapRect.height;

        tooltip.style.left = `${pxX}px`;
        tooltip.style.top = `${pxY}px`;
        tooltip.style.opacity = '1';
      });

      // Hide elements when mouse leaves a specific bounding box 
      // (usually handed off seamlessly to the next box, but handles exiting chart)
      box.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        /** @type {HTMLElement} */ (hoverDot).style.opacity = '0';
        /** @type {HTMLElement} */ (hoverLine).style.opacity = '0';
      });
    });
  },
  
  destroy: (_el) => {},
};



// =============================================================================
// FILE: scatter.widget.js
// =============================================================================

import { formatCurrency } from '../../utils/formatters.js';
import { t } from '../../utils/strings.js';
import { esc } from './esc.js';

/**
 * Advanced Statistical Engine
 * Calculates linear regression (line of best fit) and Pearson correlation.
 * @param {Array<{x: number, y: number}>} data - The scatter plot data (x: hours, y: gross)
 * @returns {Object} Regression line points, slope, intercept, and correlation coefficient (r)
 */
function calculateStatistics(data) {
  if (!data || data.length < 2) return { m: 0, b: 0, r: 0, valid: false };

  const n = data.length;
  let sumX = 0, sumY = 0, sumXY = 0, sumX2 = 0, sumY2 = 0;

  for (let i = 0; i < n; i++) {
    const { x, y } = data[i];
    sumX += x;
    sumY += y;
    sumXY += (x * y);
    sumX2 += (x * x);
    sumY2 += (y * y);
  }

  // Calculate Slope (m) and Intercept (b) for y = mx + b
  const denominator = (n * sumX2) - (sumX * sumX);
  if (denominator === 0) return { m: 0, b: 0, r: 0, valid: false }; // Vertical line edge case

  const m = ((n * sumXY) - (sumX * sumY)) / denominator;
  const b = (sumY - (m * sumX)) / n;

  // Calculate Pearson Correlation Coefficient (r)
  const rNum = (n * sumXY) - (sumX * sumY);
  const rDenom = Math.sqrt(((n * sumX2) - (sumX * sumX)) * ((n * sumY2) - (sumY * sumY)));
  const r = rDenom === 0 ? 0 : rNum / rDenom;

  return { m, b, r, valid: true };
}

/**
 * Calculates the median of an array of numbers.
 * @param {number[]} values 
 * @returns {number}
 */
function getMedian(values) {
  if (values.length === 0) return 0;
  values.sort((a, b) => a - b);
  const half = Math.floor(values.length / 2);
  if (values.length % 2) return values[half];
  return (values[half - 1] + values[half]) / 2.0;
}

export default {
  id: 'scatter',
  label: 'Earnings vs Hours',
  defaultSize: '2x1', // Wide format to accommodate the beautiful chart
  defaultVisible: false,
  category: 'analytics',

  /** @param {unknown} ctx */
  render: async (ctx) => {
    // 1. Safe Extraction of Context and Data
    const c = /** @type {{ data?: { scatter?: { x:number, y:number }[] }; localeCountry?: string; currency?: string } }} */ (ctx);
    const rawData = c?.data?.scatter || [];
    
    // Filter out 0,0 points which often represent missing data
    const data = rawData.filter(d => d.x > 0 || d.y > 0);
    
    const country = String(c?.data?.localeCountry || 'US');
    const currency = String(c?.data?.currency || 'USD');

    // If we don't have enough data to draw a meaningful scatter plot
    if (data.length === 0) {
      return `
        <div style="display:flex; flex-direction:column; height:100%; justify-content:center; align-items:center; color:var(--color-text-muted);">
          <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24" style="margin-bottom:8px; opacity:0.5;">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 8v4l3 3"></path>
          </svg>
          <span style="font-size:0.8rem; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;">Awaiting Shift Data</span>
        </div>
      `;
    }

    // Find boundaries for scaling the SVG
    // We add 10% padding to the max values so dots don't clip the edges
    const maxX = Math.max(...data.map(d => d.x)) * 1.1 || 10;
    const maxY = Math.max(...data.map(d => d.y)) * 1.1 || 100;
    
    const medX = getMedian(data.map(d => d.x));
    const medY = getMedian(data.map(d => d.y));

    // Run the Deep Analysis Engine
    const stats = calculateStatistics(data);
    let predictability = "Variable";
    let predictColor = "var(--color-warning, #f5a623)";
    
    if (stats.valid) {
      if (stats.r > 0.8) {
        predictability = "Highly Predictable";
        predictColor = "var(--color-success, #10b981)";
      } else if (stats.r > 0.5) {
        predictability = "Moderately Stable";
        predictColor = "var(--widget-accent, #8b5cf6)";
      }
    }

    // Calculate how many shifts landed in the "Golden Zone" (Above median pay, below median hours)
    let goldenShifts = 0;
    data.forEach(d => {
      if (d.x < medX && d.y > medY) goldenShifts++;
    });

    const labelText = t('analytics.scatter') || 'Efficiency Matrix';

    // SVG Canvas Dimensions
    const svgW = 400;
    const svgH = 160;

    // Generate the SVG Points
    const dotsHTML = data.map((d, index) => {
      const px = (d.x / maxX) * svgW;
      const py = svgH - ((d.y / maxY) * svgH); // Invert Y for SVG coordinates
      
      // We embed raw data into data-attributes for the custom hover interactions later
      return `<circle class="sc-dot" cx="${px}" cy="${py}" r="4.5" 
                data-x="${d.x}" data-y="${d.y}" 
                style="animation-delay: ${index * 0.02}s"></circle>`;
    }).join('');

    // Generate the Regression Line (Trendline)
    let trendlineHTML = '';
    if (stats.valid && stats.m > 0) {
      // Point 1: At x = 0
      let y1 = stats.b;
      // Point 2: At x = maxX
      let y2 = (stats.m * maxX) + stats.b;

      // Convert to SVG Space
      let py1 = svgH - ((y1 / maxY) * svgH);
      let py2 = svgH - ((y2 / maxY) * svgH);

      trendlineHTML = `<line class="sc-trendline" x1="0" y1="${py1}" x2="${svgW}" y2="${py2}"></line>`;
    }

    // Quadrant Crosshairs (Medians)
    const pxMed = (medX / maxX) * svgW;
    const pyMed = svgH - ((medY / maxY) * svgH);

    const scopedStyles = `
      <style>
        /* Fluid entrance animations for statistical data */
        @keyframes scatterPop {
          0% { transform: scale(0); opacity: 0; }
          60% { transform: scale(1.4); }
          100% { transform: scale(1); opacity: 0.6; }
        }
        @keyframes drawLine {
          from { stroke-dashoffset: 1000; opacity: 0; }
          to { stroke-dashoffset: 0; opacity: 0.4; }
        }
        @keyframes fadePulse {
          0%, 100% { opacity: 0.05; }
          50% { opacity: 0.15; }
        }

        .sc-container { display: flex; flex-direction: column; height: 100%; justify-content: space-between; padding: 4px; position: relative; }
        
        .sc-header-row { display: flex; justify-content: space-between; align-items: flex-start; z-index: 2; position: relative; }
        
        .sc-title-group { display: flex; align-items: center; gap: 10px; }
        .sc-icon-wrap {
          display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; 
          border-radius: 8px; background: color-mix(in srgb, var(--widget-accent, #8b5cf6) 15%, transparent); 
          color: var(--widget-accent, #8b5cf6);
        }

        /* Statistical Header Metrics */
        .sc-stats-group { text-align: right; }
        .sc-stat-pill {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em;
          color: ${predictColor}; background: color-mix(in srgb, ${predictColor} 10%, transparent);
          padding: 4px 8px; border-radius: 999px;
          border: 1px solid color-mix(in srgb, ${predictColor} 30%, transparent);
        }
        .sc-stat-sub { font-size: 0.65rem; font-weight: 700; color: var(--color-text-muted, #888); margin-top: 4px; letter-spacing: 0.05em; }
        
        /* The SVg Chart Container */
        .sc-chart-wrap { margin-top: 16px; flex-grow: 1; position: relative; width: 100%; height: 100%; min-height: 120px; }
        .sc-svg { width: 100%; height: 100%; overflow: visible; }
        
        /* Quadrant Analytics */
        .sc-quadrant-bg { fill: var(--color-success, #10b981); opacity: 0; animation: fadePulse 4s infinite 1s; mix-blend-mode: screen; }
        .sc-axis-line { stroke: var(--color-text-muted); stroke-width: 1; opacity: 0.2; stroke-dasharray: 4 4; }
        
        /* Trendline Data */
        .sc-trendline {
          stroke: var(--widget-accent, #8b5cf6);
          stroke-width: 2;
          stroke-dasharray: 6 6, 1000;
          stroke-linecap: round;
          fill: none;
          animation: drawLine 2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        /* Data Points */
        .sc-dot {
          fill: var(--widget-accent, #8b5cf6);
          opacity: 0; /* Starting state for animation */
          transform-origin: center;
          transform-box: fill-box;
          animation: scatterPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
          transition: all 0.2s ease;
          cursor: crosshair;
        }
        
        /* Interactive Hover States */
        .sc-dot:hover {
          fill: var(--color-text-main, #fff);
          opacity: 1 !important; /* Override animation */
          r: 6;
          filter: drop-shadow(0 0 6px var(--widget-accent));
        }

        /* Dynamic CSS-Based Tooltip (Injected by JS on hover) */
        .sc-tooltip {
          position: absolute; pointer-events: none; opacity: 0;
          background: var(--color-surface-raised, #222);
          border: 1px solid color-mix(in srgb, var(--widget-accent) 40%, transparent);
          box-shadow: 0 8px 16px rgba(0,0,0,0.4);
          padding: 8px 12px; border-radius: 8px;
          transform: translate(-50%, -120%);
          transition: opacity 0.2s, top 0.1s, left 0.1s;
          z-index: 100;
          backdrop-filter: blur(8px);
        }
        .sc-tooltip-val { font-size: 1rem; font-weight: 800; color: var(--color-text-main); font-variant-numeric: tabular-nums; }
        .sc-tooltip-lbl { font-size: 0.65rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em;}
        .sc-tooltip-row { display: flex; justify-content: space-between; gap: 16px; align-items: baseline; }
        .sc-tooltip-hr { height: 1px; background: rgba(255,255,255,0.1); margin: 6px 0; }
        
        /* Legends */
        .sc-legend { display: flex; justify-content: space-between; font-size: 0.6rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; margin-top: 8px; }
      </style>
    `;

    return `
      ${scopedStyles}
      <div class="sc-container" id="sc-container-${ctx?.id || 'main'}">
        
        <!-- Deep Analytical Header -->
        <div class="sc-header-row">
          <div class="sc-title-group">
            <div class="sc-icon-wrap">
              <!-- Target/Nodes Scatter Icon -->
              <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </div>
            <div style="display:flex; flex-direction:column;">
              <span class="stat-label">${esc(labelText)}</span>
              <span style="font-size:0.65rem; font-weight:700; color:var(--color-text-muted); margin-top:2px;">
                ${data.length} Shifts Analyzed
              </span>
            </div>
          </div>

          <!-- Intelligence Readout -->
          <div class="sc-stats-group">
            <div class="sc-stat-pill">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
              ${esc(predictability)}
            </div>
            <div class="sc-stat-sub">${goldenShifts} in Golden Zone</div>
          </div>
        </div>

        <!-- The Bespoke Analytical Scatter Canvas -->
        <div class="sc-chart-wrap" id="sc-canvas-wrap-${ctx?.id || 'main'}">
          <!-- Dynamic Tooltip Mount -->
          <div class="sc-tooltip" id="sc-tooltip-${ctx?.id || 'main'}"></div>
          
          <svg class="sc-svg" viewBox="0 0 ${svgW} ${svgH}" preserveAspectRatio="none">
            
            <!-- Golden Quadrant (Top Left: High Pay, Low Hours) -->
            <rect class="sc-quadrant-bg" x="0" y="0" width="${pxMed}" height="${pyMed}"></rect>
            
            <!-- Median Crosshairs -->
            <line class="sc-axis-line" x1="${pxMed}" y1="0" x2="${pxMed}" y2="${svgH}"></line>
            <line class="sc-axis-line" x1="0" y1="${pyMed}" x2="${svgW}" y2="${pyMed}"></line>

            <!-- Statistical Trendline -->
            ${trendlineHTML}

            <!-- Data Dots -->
            ${dotsHTML}
          </svg>
        </div>
        
        <!-- Contextual Legend -->
        <div class="sc-legend">
          <span>0 Hrs</span>
          <span style="color:var(--widget-accent); font-weight:800;">Avg: ${formatCurrency(stats.m, country, {currency})}/hr</span>
          <span>${maxX.toFixed(1)} Hrs</span>
        </div>

      </div>
    `;
  },
  
  /** 
   * @param {HTMLElement} el 
   * @param {unknown} ctx 
   */
  afterRender: (el, ctx) => {
    // Advanced Tooltip Logic without any external libraries
    const container = el.querySelector('.sc-container');
    const wrap = el.querySelector('.sc-chart-wrap');
    const tooltip = el.querySelector('.sc-tooltip');
    const dots = el.querySelectorAll('.sc-dot');
    
    if (!wrap || !tooltip || !container) return;

    // Cache the country/currency to format inside the hover state
    const c = /** @type {{ localeCountry?: string; currency?: string }} */ (ctx);
    const country = String(c?.localeCountry || 'US');
    const currency = String(c?.currency || 'USD');

    dots.forEach(dot => {
      // Mouse Enter: Calculate positions, inject data, and fade in
      dot.addEventListener('mouseenter', (e) => {
        const target = /** @type {SVGCircleElement} */ (e.target);
        
        // Extract the raw data stored in HTML attributes
        const xVal = parseFloat(target.getAttribute('data-x') || '0');
        const yVal = parseFloat(target.getAttribute('data-y') || '0');
        
        // Format the hover data
        const fmtEarn = formatCurrency(yVal, country, { currency });
        const fmtHrs = `${xVal.toFixed(1)}h`;
        const effectiveRate = xVal > 0 ? formatCurrency(yVal / xVal, country, { currency }) : '$0.00';

        // Build the tooltip DOM
        tooltip.innerHTML = `
          <div class="sc-tooltip-row">
            <span class="sc-tooltip-lbl">Earnings</span>
            <span class="sc-tooltip-val" style="color: var(--color-success, #10b981);">${fmtEarn}</span>
          </div>
          <div class="sc-tooltip-row">
            <span class="sc-tooltip-lbl">Hours</span>
            <span class="sc-tooltip-val">${fmtHrs}</span>
          </div>
          <div class="sc-tooltip-hr"></div>
          <div class="sc-tooltip-row">
            <span class="sc-tooltip-lbl">Rate</span>
            <span class="sc-tooltip-val" style="color: var(--widget-accent);">${effectiveRate}/h</span>
          </div>
        `;

        // Calculate absolute position inside the container relative to the SVG
        const wrapRect = wrap.getBoundingClientRect();
        const dotRect = target.getBoundingClientRect();
        
        // Compute relative X and Y
        const relX = dotRect.left - wrapRect.left + (dotRect.width / 2);
        const relY = dotRect.top - wrapRect.top;

        // Apply positions and reveal
        tooltip.style.left = `${relX}px`;
        tooltip.style.top = `${relY}px`;
        tooltip.style.opacity = '1';

        // Dim other dots to create focus on the hovered one
        dots.forEach(d => { if (d !== target) d.style.opacity = '0.2'; });
      });

      // Mouse Leave: Hide tooltip and restore other dots
      dot.addEventListener('mouseleave', () => {
        tooltip.style.opacity = '0';
        dots.forEach(d => d.style.opacity = '0.6'); // Restore to standard non-hover opacity
      });
    });
  },
  
  destroy: (_el) => {},
};



// =============================================================================
// FILE: schedule.widget.js
// =============================================================================

import { t } from '../../utils/strings.js';
import { esc } from './esc.js';
import { getAppState } from '../../core/db.js';

const _IC_CAL = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>`;

export default {
  id: 'schedule',
  label: 'Schedule',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'analytics',

  /** @param {unknown} ctx */
  render: async (ctx) => {
    const planningRaw = await getAppState('schedule_planning_shifts');
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];

    const upcoming = Array.isArray(planningRaw) 
      ? planningRaw
          .filter(p => p.date >= todayStr)
          .sort((a, b) => `${a.date}T${a.startTime}`.localeCompare(`${b.date}T${b.startTime}`))
          .slice(0, 3)
      : [];

    const scopedStyles = `
      <style>
        .sch-container { display: flex; flex-direction: column; height: 100%; gap: 10px; padding: 2px; }
        .sch-list { display: flex; flex-direction: column; gap: 8px; flex: 1; overflow: hidden; }
        .sch-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px;
          border-radius: 8px;
          background: var(--color-surface-raised);
          font-size: 0.75rem;
        }
        .sch-date-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          min-width: 34px;
          padding: 4px;
          border-radius: 6px;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
        }
        .sch-day-num { font-size: 0.85rem; font-weight: 800; color: var(--color-text-main); line-height: 1; }
        .sch-day-name { font-size: 0.55rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; }
        
        .sch-info { display: flex; flex-direction: column; gap: 2px; min-width: 0; }
        .sch-time { font-weight: 800; color: var(--color-text-main); }
        .sch-platform { font-size: 0.65rem; color: var(--color-text-muted); font-weight: 700; text-transform: capitalize; }
        
        .sch-empty {
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          height: 100%; text-align: center; gap: 8px;
          opacity: 0.6; padding: 0 10px;
        }
        .sch-empty-text { font-size: 0.7rem; font-weight: 700; color: var(--color-text-muted); text-transform: uppercase; letter-spacing: 0.05em; }
        .sch-empty-cta { font-size: 0.65rem; font-weight: 600; color: var(--color-brand); text-decoration: underline; }
      </style>
    `;

    if (!upcoming.length) {
      return `
        ${scopedStyles}
        <div class="wr">
          <div class="wh">
            <div class="wi">${_IC_CAL}</div>
            <span class="wl">Schedule</span>
          </div>
          <div class="sch-empty">
            <span class="sch-empty-text">No upcoming plans</span>
            <a href="#/schedule" class="sch-empty-cta">Plan a shift</a>
          </div>
        </div>
      `;
    }

    const listItems = upcoming.map(p => {
      const d = new Date(`${p.date}T12:00:00`);
      const dayName = d.toLocaleDateString(undefined, { weekday: 'short' });
      const dayNum = d.getDate();
      const color = `var(--color-${p.platformId}, var(--color-other))`;

      return `
        <div class="sch-item">
          <div class="sch-date-box" style="border-left: 3px solid ${color};">
            <span class="sch-day-num">${dayNum}</span>
            <span class="sch-day-name">${esc(dayName)}</span>
          </div>
          <div class="sch-info">
            <span class="sch-time">${esc(p.startTime)} – ${esc(p.endTime)}</span>
            <span class="sch-platform">${esc(p.platformId)}</span>
          </div>
        </div>
      `;
    }).join('');

    return `
      ${scopedStyles}
      <div class="wr">
        <div class="wh" style="margin-bottom: 8px;">
          <div class="wi">${_IC_CAL}</div>
          <span class="wl">Schedule</span>
          <span class="wb">Upcoming</span>
        </div>
        <div class="sch-list">
          ${listItems}
        </div>
      </div>
    `;
  },

  afterRender: (_el, _ctx) => {},
  destroy: (_el) => {},
};



// =============================================================================
// FILE: stability-score.widget.js
// =============================================================================

import { t } from '../../utils/strings.js';
import { esc } from './esc.js';

export default {
  id: 'stabilityScore',
  label: 'Income Stability',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'analytics',

  /** @param {unknown} ctx */
  render: async (ctx) => {
    const c = /** @type {{ data?: { stabilityScore?: { stabilityScore: number, weeklyGross?: number[] } } }} */ (ctx);
    
    // Safety boundaries for the score
    const score = Math.max(0, Math.min(100, Math.round(c?.data?.stabilityScore?.stabilityScore ?? 0)));
    const grossData = c?.data?.stabilityScore?.weeklyGross?.length 
      ? c.data.stabilityScore.weeklyGross 
      : [0, 0, 0, 0]; // Fallback flatline if no data

    let healthColor = 'var(--color-danger, #f43f5e)';
    let healthText = 'Highly Volatile';
    
    if (score >= 75) {
      healthColor = 'var(--color-success, #10b981)';
      healthText = 'Highly Stable';
    } else if (score >= 45) {
      healthColor = 'var(--color-warning, #f5a623)';
      healthText = 'Moderate Variance';
    }

    // Map the weekly gross data to X/Y coordinates for our SVG canvas (100x40)
    const svgWidth = 100;
    const svgHeight = 40;
    const maxVal = Math.max(...grossData) * 1.05 || 1; // 5% top padding
    const minVal = Math.min(...grossData) * 0.95; // 5% bottom padding
    const range = maxVal - minVal || 1; // Prevent div by zero

    const points = grossData.map((val, i) => {
      const x = (i / (grossData.length - 1)) * svgWidth;
      const y = svgHeight - ((val - minVal) / range) * svgHeight;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    });

    const pathString = `M ${points.join(' L ')}`;
    // The fill path needs to loop back to the bottom corners to complete the polygon
    const fillString = `${pathString} L ${svgWidth},${svgHeight} L 0,${svgHeight} Z`;

    const scopedStyles = `
      <style>
        @keyframes drawSparkline {
          0% { stroke-dashoffset: 200; opacity: 0; }
          10% { opacity: 1; }
          100% { stroke-dashoffset: 0; opacity: 1; }
        }
        @keyframes fadeFill {
          0% { opacity: 0; transform: translateY(5px); }
          100% { opacity: 0.2; transform: translateY(0); }
        }
        @keyframes pulseDot {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.5); opacity: 0.5; }
        }

        .ss-container { display: flex; flex-direction: column; height: 100%; justify-content: space-between; padding: 4px; }
        
        .ss-header { display: flex; align-items: center; gap: 10px; }
        .ss-icon-wrap {
          display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; 
          border-radius: 8px; background: color-mix(in srgb, var(--widget-accent, #8b5cf6) 15%, transparent); 
          color: var(--widget-accent, #8b5cf6);
        }

        .ss-body { margin-top: 12px; }
        
        .ss-score-row { display: flex; align-items: baseline; gap: 6px; }
        .ss-score-val { font-size: 2.25rem; font-weight: 800; line-height: 1; letter-spacing: -0.03em; color: ${healthColor}; transition: color 0.3s ease; }
        .ss-score-max { font-size: 0.85rem; font-weight: 700; color: var(--color-text-muted, #888); }

        .ss-qualitative {
          display: inline-flex; align-items: center; gap: 6px; margin-top: 6px;
          font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em;
          color: ${healthColor}; background: color-mix(in srgb, ${healthColor} 10%, transparent);
          padding: 4px 8px; border-radius: 999px;
        }

        /* Pure SVG Sparkline styling */
        .ss-chart-wrap { margin-top: auto; padding-top: 12px; height: 45px; position: relative; }
        .ss-svg { width: 100%; height: 100%; overflow: visible; }
        
        .ss-path-line {
          fill: none;
          stroke: ${healthColor};
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-linejoin: round;
          stroke-dasharray: 200; /* Arbitrary large number for the drawing animation */
          stroke-dashoffset: 200;
          animation: drawSparkline 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .ss-path-fill {
          fill: url(#ss-gradient);
          opacity: 0;
          animation: fadeFill 1s cubic-bezier(0.2, 0.8, 0.2, 1) 0.6s forwards;
        }

        /* Little glowing dot at the end of the line */
        .ss-end-dot {
          fill: ${healthColor};
          animation: fadeFill 1s ease-out 0.8s forwards, pulseDot 2s infinite 1.5s;
          opacity: 0;
        }
      </style>
    `;

    const labelText = t('analytics.stabilityScore') || 'Income Stability';
    const lastPoint = points[points.length - 1].split(',');

    return `
      ${scopedStyles}
      <div class="ss-container">
        
        <!-- Header -->
        <div class="ss-header">
          <div class="ss-icon-wrap">
            <!-- Balance / Metronome Icon -->
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
          </div>
          <span class="stat-label">${esc(labelText)}</span>
        </div>

        <!-- Typography & Health Grade -->
        <div class="ss-body">
          <div class="ss-score-row">
            <span class="ss-score-val">${score}</span>
            <span class="ss-score-max">/ 100</span>
          </div>
          <div class="ss-qualitative">
            ${esc(healthText)}
          </div>
        </div>

        <!-- Dynamic SVG Sparkline Visualizer -->
        <div class="ss-chart-wrap">
          <svg class="ss-svg" viewBox="0 0 ${svgWidth} ${svgHeight}" preserveAspectRatio="none">
            <defs>
              <linearGradient id="ss-gradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stop-color="${healthColor}" stop-opacity="1"/>
                <stop offset="100%" stop-color="${healthColor}" stop-opacity="0"/>
              </linearGradient>
            </defs>
            
            <path class="ss-path-fill" d="${fillString}"></path>
            <path class="ss-path-line" d="${pathString}"></path>
            
            <!-- Live Indicator Dot at the end of the trend -->
            <circle class="ss-end-dot" cx="${lastPoint[0]}" cy="${lastPoint[1]}" r="2.5"></circle>
          </svg>
        </div>

      </div>
    `;
  },
  
  // Chart.js completely removed! This runs purely on the DOM now.
  afterRender: (_el, _ctx) => {},
  destroy: (_el) => {},
};



// =============================================================================
// FILE: streak.widget.js
// =============================================================================

import { formatLargeNumber } from '../../utils/formatters.js';
import { t }                 from '../../utils/strings.js';
import { esc }               from './esc.js';

const _IC_FLAME = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`;

export default {
  id: 'streak',
  label: 'Streak',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'stats',

  render: async (ctx) => {
    const c = /** @type {any} */ (ctx);
    const n = Number(c?.data?.streakCount) || 0;
    const unit   = n === 1 ? 'day' : 'days';
    const badge  = n >= 30 ? '🔥 On fire!' : n >= 7 ? '⭐ Hot streak' : n >= 3 ? 'Keep going' : n > 0 ? 'Started' : 'No streak';
    const badgeCls = n >= 7 ? 'pos' : n >= 3 ? 'warn' : 'neu';

    return `
      <div class="wr">
        <div class="wh">
          <div class="wi">${_IC_FLAME}</div>
          <span class="wl">${esc(t('analytics.streak'))}</span>
          <span class="wb ${badgeCls}">${esc(badge)}</span>
        </div>
        <div class="wstreak">
          <div class="wstreak-fire" aria-hidden="true">🔥</div>
          <div class="wstreak-body">
            <div class="wv">${esc(formatLargeNumber(n))}</div>
            <div class="ws">${esc(unit)} in a row</div>
          </div>
        </div>
      </div>`;
  },
  afterRender: (_el, _ctx) => {},
  destroy:     (_el)       => {},
};



// =============================================================================
// FILE: tax-jar.widget.js
// =============================================================================

import { formatCurrency } from '../../utils/formatters.js';
import { t } from '../../utils/strings.js';
import { esc } from './esc.js';

const _IC_JAR = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v5"></path><path d="M5 12a7 7 0 0 0 14 0"></path><path d="M12 7v5"></path><rect x="8" y="2" width="8" height="3" rx="1"></rect></svg>`;

export default {
  id: 'taxJar',
  label: 'Tax Jar',
  defaultSize: '1x1',
  defaultVisible: true,
  category: 'financial',

  /** @param {unknown} ctx */
  render: async (ctx) => {
    const c = /** @type {{ data?: { financial?: { gross?: number, expense?: number }; localeCountry?: string; currency?: string } }} */ (ctx);
    
    const gross = Number(c?.data?.financial?.gross || 0);
    const expense = Number(c?.data?.financial?.expense || 0);
    const net = Math.max(0, gross - expense);
    
    // Estimation: 25% of net income
    const taxRate = 0.25;
    const estimatedTax = net * taxRate;
    const postTax = net - estimatedTax;

    const country = String(c?.localeCountry || 'US');
    const currency = String(c?.currency || 'USD');

    const fmtTax = formatCurrency(estimatedTax, country, { currency });
    const fmtPostTax = formatCurrency(postTax, country, { currency });

    const scopedStyles = `
      <style>
        @keyframes jarFill {
          from { transform: scaleY(0); }
          to { transform: scaleY(1); }
        }
        @keyframes jarLiquid {
          0%, 100% { transform: translateY(0) scaleY(1); }
          50% { transform: translateY(-2px) scaleY(1.02); }
        }

        .tj-container {
          display: flex;
          flex-direction: column;
          height: 100%;
          justify-content: space-between;
          padding: 4px;
        }

        .tj-header {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .tj-icon-wrap {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          border-radius: 8px;
          background: color-mix(in srgb, var(--color-warning, #f59e0b) 15%, transparent);
          color: var(--color-warning, #f59e0b);
        }

        .tj-body {
          margin-top: 8px;
        }

        .tj-val {
          font-size: 1.8rem;
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.03em;
          color: var(--color-text-main);
          font-variant-numeric: tabular-nums;
        }

        .tj-label {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--color-text-muted);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-top: 2px;
        }

        .tj-viz {
          position: relative;
          height: 40px;
          width: 100%;
          background: var(--color-surface-raised);
          border-radius: 8px;
          overflow: hidden;
          margin-top: auto;
          display: flex;
          align-items: flex-end;
        }

        .tj-fill {
          width: 100%;
          height: ${Math.min(100, (estimatedTax / (gross || 1)) * 300)}%; /* Scale visually */
          background: linear-gradient(to top, var(--color-warning), color-mix(in srgb, var(--color-warning) 70%, white));
          transform-origin: bottom;
          animation: jarFill 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }

        .tj-post-tax {
          font-size: 0.65rem;
          font-weight: 700;
          color: var(--color-success);
          margin-top: 6px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .tj-post-tax-val { font-weight: 800; font-variant-numeric: tabular-nums; }
      </style>
    `;

    return `
      ${scopedStyles}
      <div class="tj-container">
        <div class="tj-header">
          <div class="tj-icon-wrap">${_IC_JAR}</div>
          <span class="stat-label">Tax Jar</span>
        </div>

        <div class="tj-body">
          <div class="tj-val">${esc(fmtTax)}</div>
          <div class="tj-label">Estimated Set-Aside (25%)</div>
        </div>

        <div class="tj-viz">
          <div class="tj-fill"></div>
        </div>

        <div class="tj-post-tax">
          <span>Net After Tax</span>
          <span class="tj-post-tax-val">${esc(fmtPostTax)}</span>
        </div>
      </div>
    `;
  },

  afterRender: (_el, _ctx) => {},
  destroy: (_el) => {},
};



// =============================================================================
// FILE: tips-total.widget.js
// =============================================================================

import { formatCurrency } from '../../utils/formatters.js';
import { t } from '../../utils/strings.js';
import { esc } from './esc.js';

export default {
  id: 'tipsTotal',
  label: 'Tips Total',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'financial',
  
  /** @param {unknown} ctx */
  render: async (ctx) => {
    const c = /** @type {{ data?: { financial?: { tips?: number, gross?: number }; localeCountry?: string; currency?: string } }} */ (ctx);
    
    const tips = Number(c?.data?.financial?.tips) || 0;
    const gross = Number(c?.data?.financial?.gross) || 0;
    const country = String(c?.data?.localeCountry || 'US');
    const currency = String(c?.data?.currency || 'USD');

    // Calculate how much of their total income is purely from tips
    const tipsPct = gross > 0 ? (tips / gross) * 100 : 0;
    
    const labelText = t('views.dashboard.financial.tipsTotal') || 'Tips Total';
    const formattedTips = formatCurrency(tips, country, { currency });

    const scopedStyles = `
      <style>
        /* A premium metallic/shimmer text effect for the tip value */
        @keyframes shimmerText {
          0% { background-position: -200% center; }
          100% { background-position: 200% center; }
        }

        /* Ambient floating particles to represent "extra" value */
        @keyframes floatSparkle {
          0% { transform: translateY(10px) scale(0.5) rotate(0deg); opacity: 0; }
          30% { opacity: 0.6; }
          70% { opacity: 0.6; }
          100% { transform: translateY(-30px) scale(1.2) rotate(45deg); opacity: 0; }
        }
        
        @keyframes scaleIn {
          0% { transform: scale(0.9); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        .tt-container { display: flex; flex-direction: column; height: 100%; justify-content: space-between; padding: 4px; position: relative; }
        
        .tt-header { display: flex; align-items: center; gap: 10px; position: relative; z-index: 2; }
        .tt-icon-wrap {
          display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; 
          border-radius: 8px; background: color-mix(in srgb, var(--widget-accent, #3b82f6) 15%, transparent); 
          color: var(--widget-accent, #3b82f6);
        }

        /* Typography & Value */
        .tt-body { margin-top: 12px; position: relative; z-index: 2; animation: scaleIn 0.4s cubic-bezier(0.2, 0.8, 0.2, 1); }
        
        .tt-value { 
          font-size: 2.25rem; 
          font-weight: 800; 
          line-height: 1.1; 
          letter-spacing: -0.03em; 
          /* The Shimmer Gradient */
          background: linear-gradient(
            110deg, 
            var(--color-text-main) 0%, 
            var(--color-text-main) 40%, 
            var(--widget-accent, #3b82f6) 50%, 
            var(--color-text-main) 60%, 
            var(--color-text-main) 100%
          );
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          background-clip: text;
          animation: shimmerText 5s linear infinite;
        }

        /* Insight Badge */
        .tt-badge {
          display: inline-flex; align-items: center; gap: 6px; margin-top: 8px;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.03em;
          color: var(--color-text-main); 
          background: var(--color-surface-raised, rgba(150, 150, 150, 0.15));
          padding: 4px 8px; border-radius: 6px;
          box-shadow: inset 0 1px 2px rgba(255,255,255,0.05);
        }
        .tt-badge-highlight { color: var(--widget-accent, #3b82f6); font-weight: 800; font-variant-numeric: tabular-nums; }

        /* Floating Background Particles */
        .tt-particle-layer { position: absolute; inset: 0; pointer-events: none; overflow: hidden; z-index: 1; border-radius: inherit; }
        .tt-sparkle { position: absolute; fill: var(--widget-accent, #3b82f6); opacity: 0; mix-blend-mode: screen; }
        .tt-sparkle-1 { right: 10%; bottom: 15%; width: 20px; animation: floatSparkle 4s infinite 0.5s; }
        .tt-sparkle-2 { right: 25%; bottom: 5%; width: 12px; animation: floatSparkle 3.5s infinite 1.8s; }
        .tt-sparkle-3 { right: 5%; bottom: 30%; width: 14px; animation: floatSparkle 5s infinite 3.2s; }
      </style>
    `;

    return `
      ${scopedStyles}
      <div class="tt-container">
        
        <!-- Header -->
        <div class="tt-header">
          <div class="tt-icon-wrap">
            <!-- Sparkle / Star Icon indicating bonus value -->
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"></path>
            </svg>
          </div>
          <span class="stat-label">${esc(labelText)}</span>
        </div>

        <!-- Metric Body -->
        <div class="tt-body">
          <div class="tt-value">${esc(formattedTips)}</div>
          
          <!-- Intelligence Badge (Only show if > 0 to avoid 0% clutter) -->
          ${tipsPct > 0 ? `
            <div class="tt-badge">
              <svg width="12" height="12" fill="currentColor" viewBox="0 0 24 24" style="color: var(--widget-accent);">
                <path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"></path>
              </svg>
              <span><span class="tt-badge-highlight">${tipsPct.toFixed(1)}%</span> of total earnings</span>
            </div>
          ` : `
            <div class="tt-badge">Awaiting tips</div>
          `}
        </div>

        <!-- Ambient Particle Animation Layer -->
        <div class="tt-particle-layer">
          <svg class="tt-sparkle tt-sparkle-1" viewBox="0 0 24 24"><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"></path></svg>
          <svg class="tt-sparkle tt-sparkle-2" viewBox="0 0 24 24"><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"></path></svg>
          <svg class="tt-sparkle tt-sparkle-3" viewBox="0 0 24 24"><path d="M12 2l2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"></path></svg>
        </div>

      </div>
    `;
  },
  
  afterRender: (_el, _ctx) => {},
  destroy: (_el) => {},
};



// =============================================================================
// FILE: total-hours.widget.js
// =============================================================================

import { t } from '../../utils/strings.js';
import { esc } from './esc.js';

export default {
  id: 'totalHours',
  label: 'Total Hours',
  defaultSize: '1x1',
  defaultVisible: true,
  category: 'financial',
  
  /** @param {unknown} ctx */
  render: async (ctx) => {
    const c = /** @type {{ data?: { financial?: { hours?: number } } }} */ (ctx);
    const hrs = Number(c?.data?.financial?.hours) || 0;
    
    // Split the decimal for typographic styling (e.g., "42" and "50")
    const fixedHrs = hrs.toFixed(2);
    const [intPart, decPart] = fixedHrs.split('.');

    // Humanize the decimal into actual Hours & Minutes (e.g., 42h 30m)
    const exactHours = Math.floor(hrs);
    const exactMinutes = Math.round((hrs - exactHours) * 60);
    
    const labelText = t('views.dashboard.financial.totalHours') || 'Total Hours';
    const hrsSuffix = t('views.dashboard.financial.hoursSuffix') || 'hrs';

    const scopedStyles = `
      <style>
        /* Smooth infinite rotation for the abstract clock dials */
        @keyframes spinClockwise {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spinCounter {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes fadeUpIn {
          0% { opacity: 0; transform: translateY(5px); }
          100% { opacity: 1; transform: translateY(0); }
        }

        .th-container { display: flex; flex-direction: column; height: 100%; justify-content: space-between; padding: 4px; position: relative; }
        
        .th-header { display: flex; align-items: center; gap: 10px; position: relative; z-index: 2; }
        .th-icon-wrap {
          display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; 
          border-radius: 8px; background: color-mix(in srgb, var(--widget-accent, #3b82f6) 15%, transparent); 
          color: var(--widget-accent, #3b82f6);
        }

        /* Typographic Odometer styling */
        .th-value-wrap { 
          margin-top: 8px; 
          display: flex; 
          align-items: baseline; 
          position: relative; 
          z-index: 2;
          animation: fadeUpIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1);
        }
        .th-int { font-size: 2.5rem; font-weight: 800; line-height: 1; letter-spacing: -0.03em; color: var(--color-text-main); }
        .th-dec { font-size: 1.25rem; font-weight: 700; color: var(--color-text-muted, #888); margin-left: 1px; }
        .th-suffix { font-size: 0.8rem; font-weight: 700; color: var(--widget-accent); margin-left: 6px; text-transform: uppercase; letter-spacing: 0.05em; }

        /* The human-readable badge */
        .th-human-time {
          display: inline-flex; align-items: center; gap: 4px; margin-top: auto;
          font-size: 0.7rem; font-weight: 700; letter-spacing: 0.05em;
          color: var(--color-text-main); 
          background: var(--color-surface-raised, rgba(150, 150, 150, 0.15));
          padding: 4px 8px; border-radius: 6px;
          width: max-content;
          position: relative; z-index: 2;
        }
        .th-ht-highlight { color: var(--widget-accent); font-weight: 800; }

        /* Abstract Background Dials */
        .th-dial-svg {
          position: absolute;
          bottom: -15%;
          right: -10%;
          width: 65%;
          height: 65%;
          color: var(--widget-accent);
          opacity: 0.12; /* Subtle background presence */
          pointer-events: none;
          z-index: 1;
        }
        
        .th-ring-outer { transform-origin: 50px 50px; animation: spinClockwise 25s linear infinite; }
        .th-ring-inner { transform-origin: 50px 50px; animation: spinCounter 15s linear infinite; }
      </style>
    `;

    return `
      ${scopedStyles}
      <div class="th-container">
        
        <!-- Header -->
        <div class="th-header">
          <div class="th-icon-wrap">
            <!-- Stopwatch Icon -->
            <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
              <circle cx="12" cy="13" r="8"></circle>
              <path d="M12 9v4l2 2"></path>
              <path d="M10 2h4"></path>
            </svg>
          </div>
          <span class="stat-label">${esc(labelText)}</span>
        </div>

        <!-- Big Metric -->
        <div class="th-value-wrap">
          <span class="th-int">${esc(intPart)}</span>
          <span class="th-dec">.${esc(decPart)}</span>
          <span class="th-suffix">${esc(hrsSuffix)}</span>
        </div>

        <!-- Translated Hours & Minutes Badge -->
        <div class="th-human-time">
          <svg width="12" height="12" fill="none" stroke="var(--widget-accent)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
          <span class="th-ht-highlight">${exactHours}h</span>
          <span class="th-ht-highlight">${exactMinutes}m</span>
          <span>ACTIVE</span>
        </div>

        <!-- Abstract Motion Background -->
        <svg class="th-dial-svg" viewBox="0 0 100 100">
          <circle class="th-ring-outer" cx="50" cy="50" r="42" fill="none" stroke="currentColor" stroke-width="6" stroke-dasharray="14 10" stroke-linecap="round"></circle>
          <circle class="th-ring-inner" cx="50" cy="50" r="28" fill="none" stroke="currentColor" stroke-width="4" stroke-dasharray="6 8" stroke-linecap="round"></circle>
        </svg>

      </div>
    `;
  },
  
  afterRender: (_el, _ctx) => {},
  destroy: (_el) => {},
};



// =============================================================================
// FILE: week-compare.widget.js
// =============================================================================

import { formatCurrency } from '../../utils/formatters.js';
import { t }              from '../../utils/strings.js';
import { esc }            from './esc.js';

const _IC_TREND_UP = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>`;
const _IC_TREND_DN = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/><polyline points="17 18 23 18 23 12"/></svg>`;

export default {
  id: 'weekCompare',
  label: 'Week over Week',
  defaultSize: '1x1',
  defaultVisible: true,
  category: 'stats',

  render: async (ctx) => {
    const c        = /** @type {any} */ (ctx);
    const delta    = Number(c?.data?.weekCompare?.delta) || 0;
    const country  = String(c?.data?.localeCountry || 'US');
    const currency = String(c?.data?.currency      || 'USD');
    const isUp     = delta >= 0;
    const color    = delta === 0 ? 'var(--color-text-muted)' : isUp ? '#10b981' : '#f43f5e';
    const icon     = delta === 0 ? '' : isUp ? _IC_TREND_UP : _IC_TREND_DN;
    const sign     = delta > 0 ? '+' : '';
    const badge    = isUp ? 'pos' : delta < 0 ? 'neg' : 'neu';
    const text     = isUp ? 'vs last week' : 'vs last week';

    return `
      <div class="wr">
        <div class="wh">
          <div class="wi" style="color:${color}">${icon || _IC_TREND_UP}</div>
          <span class="wl">${esc(t('analytics.compare'))}</span>
          <span class="wb ${badge}">${isUp ? '▲' : delta < 0 ? '▼' : '—'} WoW</span>
        </div>
        <div class="wv" style="color:${color}">
          ${sign}${esc(formatCurrency(delta, country, { currency }))}
        </div>
        <div class="ws">${esc(text)}</div>
      </div>`;
  },
  afterRender: (_el, _ctx) => {},
  destroy:     (_el)       => {},
};



// =============================================================================
// FILE: weekly-goal.widget.js
// =============================================================================

import { formatCurrency } from '../../utils/formatters.js';
import { t }              from '../../utils/strings.js';
import { esc }            from './esc.js';

const _IC_TARGET = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`;

export default {
  id: 'weeklyGoal',
  label: 'Weekly Goal',
  defaultSize: '1x1',
  defaultVisible: true,
  category: 'stats',

  render: async (ctx) => {
    const c        = /** @type {any} */ (ctx);
    const target   = Number(c?.data?.weeklyProjection) || 0;
    const actual   = Number(c?.data?.financial?.gross) || 0;
    const country  = String(c?.data?.localeCountry || 'US');
    const currency = String(c?.data?.currency      || 'USD');
    const pct      = target > 0 ? Math.min(100, Math.round((actual / target) * 100)) : 0;
    const badge    = pct >= 100 ? 'pos' : pct >= 75 ? 'warn' : 'neu';

    return `
      <div class="wr">
        <div class="wh">
          <div class="wi">${_IC_TARGET}</div>
          <span class="wl">${esc(t('analytics.projection'))}</span>
          ${target > 0 ? `<span class="wb ${badge}">${pct}%</span>` : ''}
        </div>
        <div class="wv">${esc(formatCurrency(target, country, { currency }))}</div>
        ${target > 0 ? `
        <div class="wpb">
          <div class="wpf" style="width:${pct}%"></div>
        </div>
        <div class="wf">
          <span class="ws">current: ${esc(formatCurrency(actual, country, { currency }))}</span>
          <span class="ws">${pct}% done</span>
        </div>` : '<div class="ws">weekly target</div>'}
      </div>`;
  },
  afterRender: (_el, _ctx) => {},
  destroy:     (_el)       => {},
};



// =============================================================================
// FILE: weekly-projection.widget.js
// =============================================================================

import { formatCurrency } from '../../utils/formatters.js';
import { t }              from '../../utils/strings.js';
import { esc }            from './esc.js';

const _IC_BARCHART = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="18" y="3" width="4" height="18" rx="1"/><rect x="10" y="8" width="4" height="13" rx="1"/><rect x="2" y="13" width="4" height="8" rx="1"/></svg>`;

export default {
  id: 'weeklyProjection',
  label: 'Weekly Projection',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'analytics',

  render: async (ctx) => {
    const c          = /** @type {any} */ (ctx);
    const projected  = Number(c?.data?.projection)        || 0;
    const actual     = Number(c?.data?.financial?.gross)  || 0;
    const country    = String(c?.data?.localeCountry || 'US');
    const currency   = String(c?.data?.currency      || 'USD');
    const pct        = projected > 0 ? Math.min(100, Math.round((actual / projected) * 100)) : 0;
    const remaining  = Math.max(0, projected - actual);
    const badge      = pct >= 100 ? 'pos' : pct >= 75 ? 'warn' : 'neu';

    // Days info
    const dayOfWeek  = new Date().getDay(); // 0=Sun
    const daysLeft   = 7 - dayOfWeek;

    return `
      <div class="wr">
        <div class="wh">
          <div class="wi">${_IC_BARCHART}</div>
          <span class="wl">${esc(t('analytics.weeklyProjection') || 'Weekly Projection')}</span>
          <span class="wb ${badge}">${pct}%</span>
        </div>
        <div class="wv">${esc(formatCurrency(projected, country, { currency }))}</div>
        <div class="wpb">
          <div class="wpf" style="width:${pct}%"></div>
        </div>
        <div class="wss">
          <div class="wsc">
            <span class="wscl">Earned</span>
            <span class="wscv">${esc(formatCurrency(actual, country, { currency }))}</span>
          </div>
          <div class="wsc">
            <span class="wscl">Remaining</span>
            <span class="wscv ${remaining > 0 ? 'neg' : 'pos'}">${esc(formatCurrency(remaining, country, { currency }))}</span>
          </div>
          <div class="wsc">
            <span class="wscl">Days left</span>
            <span class="wscv">${esc(String(daysLeft))}</span>
          </div>
        </div>
      </div>`;
  },
  afterRender: (_el, _ctx) => {},
  destroy:     (_el)       => {},
};



// =============================================================================
// FILE: zero-days.widget.js
// =============================================================================

import { formatLargeNumber } from '../../utils/formatters.js';
import { t }                 from '../../utils/strings.js';
import { esc }               from './esc.js';

const _IC_XCIRCLE = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`;

export default {
  id: 'zeroDays',
  label: 'Zero Days',
  defaultSize: '1x1',
  defaultVisible: false,
  category: 'analytics',

  render: async (ctx) => {
    const c      = /** @type {any} */ (ctx);
    const n      = Number(c?.data?.zeroDaysCount) || 0;
    const DOTS   = 28; // 4-week grid
    const active = DOTS - Math.min(n, DOTS);
    const badge  = n === 0 ? 'pos' : n <= 3 ? 'warn' : 'neg';
    const label  = n === 0 ? 'Perfect' : n <= 3 ? 'Good' : 'Review';

    // Build calendar dot grid: zero days = accent (rose), active days = green tint
    // Distribute zero-day dots evenly for visual representation
    const dotsHtml = Array.from({ length: DOTS }, (_, i) => {
      const cls = i < n ? 'z' : i < DOTS ? 'nt' : 'ft';
      return `<div class="wcd ${cls}"></div>`;
    }).join('');

    return `
      <div class="wr">
        <div class="wh">
          <div class="wi">${_IC_XCIRCLE}</div>
          <span class="wl">${esc(t('analytics.zeroDays'))}</span>
          <span class="wb ${badge}">${esc(label)}</span>
        </div>
        <div style="display:flex;align-items:baseline;gap:6px;flex-shrink:0">
          <div class="wv">${esc(formatLargeNumber(n))}</div>
          <div class="ws">zero-earning days</div>
        </div>
        <div class="wcg" style="flex:1;padding-top:4px">${dotsHtml}</div>
        <div class="ws" style="font-size:9px">
          <span style="color:var(--wa)">■</span> zero &nbsp;
          <span style="color:#10b981">■</span> active &nbsp;
          <span style="opacity:.4">■</span> rest
        </div>
      </div>`;
  },
  afterRender: (_el, _ctx) => {},
  destroy:     (_el)       => {},
};


