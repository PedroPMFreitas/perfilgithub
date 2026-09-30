import { StreakStats } from '../github';
import { Theme } from '../themes';
import { icons } from './icons';

interface StreakCardOptions {
  theme: Theme;
  hideBorder?: boolean;
  borderRadius?: number;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  });
}

function formatDateRange(start: string, end: string): string {
  if (!start && !end) return '';
  if (start === end) return formatDate(start);
  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function renderStreakCard(streak: StreakStats, options: StreakCardOptions): string {
  const { theme, hideBorder = false, borderRadius = 6 } = options;

  const width = 495;
  const height = 195;
  const strokeAttr = hideBorder ? 'stroke="none"' : `stroke="${theme.border}" stroke-width="1"`;

  const colWidth = width / 3;

  const totalRange = `${formatDate(streak.firstContributionDate)} - Present`;
  const currentRange = streak.currentStreak.count > 0 
    ? formatDateRange(streak.currentStreak.start, streak.currentStreak.end)
    : 'No active streak';
  const longestRange = streak.longestStreak.count > 0
    ? formatDateRange(streak.longestStreak.start, streak.longestStreak.end)
    : 'None';

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .stat-number {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 28px;
      font-weight: 700;
      fill: ${theme.title};
    }
    .stat-label {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 13px;
      font-weight: 600;
      fill: ${theme.text};
    }
    .stat-date {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 11px;
      fill: ${theme.subtext};
    }
    .divider {
      stroke: ${theme.border};
      stroke-width: 1;
    }
  </style>
  <rect
    x="0.5"
    y="0.5"
    width="${width - 1}"
    height="${height - 1}"
    rx="${borderRadius}"
    fill="${theme.bg}"
    ${strokeAttr}
  />

  <!-- Coluna 1: Total Contributions -->
  <g transform="translate(${colWidth * 0.5}, 0)">
    <text class="stat-number" x="0" y="75" text-anchor="middle">${streak.totalContributions.toLocaleString()}</text>
    <text class="stat-label" x="0" y="105" text-anchor="middle">Total Contributions</text>
    <text class="stat-date" x="0" y="130" text-anchor="middle">${totalRange}</text>
  </g>

  <!-- Divisor 1 -->
  <line class="divider" x1="${colWidth}" y1="35" x2="${colWidth}" y2="${height - 35}" />

  <!-- Coluna 2: Current Streak -->
  <g transform="translate(${colWidth * 1.5}, 0)">
    <g fill="${theme.fire}" transform="translate(-14, 25)">
      ${icons.fire}
    </g>
    <text class="stat-number" x="0" y="88" text-anchor="middle">${streak.currentStreak.count}</text>
    <text class="stat-label" x="0" y="112" text-anchor="middle">Current Streak</text>
    <text class="stat-date" x="0" y="134" text-anchor="middle">${currentRange}</text>
  </g>

  <!-- Divisor 2 -->
  <line class="divider" x1="${colWidth * 2}" y1="35" x2="${colWidth * 2}" y2="${height - 35}" />

  <!-- Coluna 3: Longest Streak -->
  <g transform="translate(${colWidth * 2.5}, 0)">
    <text class="stat-number" x="0" y="75" text-anchor="middle">${streak.longestStreak.count}</text>
    <text class="stat-label" x="0" y="105" text-anchor="middle">Longest Streak</text>
    <text class="stat-date" x="0" y="130" text-anchor="middle">${longestRange}</text>
  </g>
</svg>
  `.trim();
}
