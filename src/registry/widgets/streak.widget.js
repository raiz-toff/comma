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
