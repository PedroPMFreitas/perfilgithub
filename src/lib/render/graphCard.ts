import { Theme } from '../themes';

interface DayContribution {
  date: string;
  count: number;
}

interface GraphCardOptions {
  theme: Theme;
  hideBorder?: boolean;
  borderRadius?: number;
  customTitle?: string;
}

export function renderGraphCard(
  weeks: Array<{ contributionDays: DayContribution[] }>,
  options: GraphCardOptions
): string {
  const { theme, hideBorder = false, borderRadius = 6, customTitle = 'Contribution Graph' } = options;

  const cellWidth = 10;
  const cellHeight = 10;
  const cellGap = 3;
  const startX = 25;
  const startY = 60;

  // Limitar às últimas 45-52 semanas para caber perfeitamente no cartão
  const displayWeeks = weeks.slice(-48);
  const width = Math.max(700, startX + displayWeeks.length * (cellWidth + cellGap) + 25);
  const height = 180;
  const strokeAttr = hideBorder ? 'stroke="none"' : `stroke="${theme.border}" stroke-width="1"`;

  const getCellColor = (count: number): string => {
    if (count === 0) return '#32302f';
    if (count <= 2) return '#79740e';
    if (count <= 5) return '#98971a';
    if (count <= 9) return '#b8bb26';
    return '#8ec07c';
  };

  let totalCount = 0;
  const cells = displayWeeks
    .map((week, wIdx) => {
      const colX = startX + wIdx * (cellWidth + cellGap);
      return week.contributionDays
        .map((day, dIdx) => {
          totalCount += day.count;
          const rowY = startY + dIdx * (cellHeight + cellGap);
          const color = getCellColor(day.count);
          return `<rect x="${colX}" y="${rowY}" width="${cellWidth}" height="${cellHeight}" rx="2" fill="${color}">
            <title>${day.date}: ${day.count} contributions</title>
          </rect>`;
        })
        .join('');
    })
    .join('');

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 16px;
      font-weight: 700;
      fill: ${theme.title};
    }
    .subtitle {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 12px;
      fill: ${theme.subtext};
    }
    .legend-text {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 10px;
      fill: ${theme.subtext};
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
  <text class="title" x="25" y="34">${customTitle}</text>
  <text class="subtitle" x="${width - 25}" y="34" text-anchor="end">${totalCount.toLocaleString()} contributions in this period</text>

  <!-- Grid de Contribuições -->
  <g>${cells}</g>

  <!-- Legenda -->
  <g transform="translate(${width - 145}, ${height - 18})">
    <text class="legend-text" x="-8" y="9" text-anchor="end">Less</text>
    <rect x="0" y="0" width="10" height="10" rx="2" fill="#32302f" />
    <rect x="13" y="0" width="10" height="10" rx="2" fill="#79740e" />
    <rect x="26" y="0" width="10" height="10" rx="2" fill="#98971a" />
    <rect x="39" y="0" width="10" height="10" rx="2" fill="#b8bb26" />
    <rect x="52" y="0" width="10" height="10" rx="2" fill="#8ec07c" />
    <text class="legend-text" x="70" y="9">More</text>
  </g>
</svg>
  `.trim();
}
