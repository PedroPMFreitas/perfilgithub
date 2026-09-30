import { UserStats } from '../github';
import { Theme } from '../themes';
import { icons } from './icons';

interface StatsCardOptions {
  theme: Theme;
  hideBorder?: boolean;
  borderRadius?: number;
}

export function renderStatsCard(stats: UserStats, options: StatsCardOptions): string {
  const { theme, hideBorder = false, borderRadius = 6 } = options;

  const width = 450;
  const height = 195;
  const strokeAttr = hideBorder ? 'stroke="none"' : `stroke="${theme.border}" stroke-width="1"`;

  const items = [
    { icon: icons.star, label: 'Total Stars Earned:', value: stats.totalStars.toLocaleString() },
    { icon: icons.commit, label: 'Total Commits:', value: stats.totalCommits.toLocaleString() },
    { icon: icons.pr, label: 'Total PRs:', value: stats.totalPRs.toLocaleString() },
    { icon: icons.issue, label: 'Total Issues:', value: stats.totalIssues.toLocaleString() },
    { icon: icons.repo, label: 'Contributed to:', value: stats.contributedTo.toLocaleString() },
  ];

  const rows = items
    .map((item, index) => {
      const y = 70 + index * 24;
      return `
      <g class="stat-row" transform="translate(25, ${y})">
        <g fill="${theme.icon}">${item.icon}</g>
        <text class="stat-label" x="25" y="12.5" fill="${theme.text}">${item.label}</text>
        <text class="stat-value" x="${width - 50}" y="12.5" text-anchor="end" fill="${theme.text}" font-weight="600">${item.value}</text>
      </g>
      `;
    })
    .join('');

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 17px;
      font-weight: 700;
      fill: ${theme.title};
    }
    .stat-label {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 13px;
    }
    .stat-value {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 13px;
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
  <text class="title" x="25" y="36">${stats.name}'s GitHub Stats</text>
  ${rows}
</svg>
  `.trim();
}
