import { StreakStats } from '../github';
import { Theme } from '../themes';

interface StreakCardOptions {
  theme: Theme;
  hideBorder?: boolean;
  borderRadius?: number;
  fireColor?: string;
  ringColor?: string;
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

function formatShortDate(dateStr: string): string {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00Z');
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

function formatDateRange(start: string, end: string): string {
  if (!start && !end) return '';
  if (start === end) return formatShortDate(start);
  return `${formatShortDate(start)} - ${formatShortDate(end)}`;
}

export function renderStreakCard(streak: StreakStats, options: StreakCardOptions): string {
  const { theme, hideBorder = false, borderRadius = 6, fireColor, ringColor } = options;

  const width = 495;
  const height = 195;
  const strokeAttr = hideBorder ? 'stroke="none"' : `stroke="${theme.border}" stroke-width="1"`;

  const activeFire = fireColor ? `#${fireColor.replace('#', '')}` : theme.fire;
  const activeRing = ringColor ? `#${ringColor.replace('#', '')}` : theme.ring;

  const totalRange = `${formatDate(streak.firstContributionDate)} - Present`;
  const currentRange = streak.currentStreak.count > 0 
    ? formatDateRange(streak.currentStreak.start, streak.currentStreak.end)
    : 'No active streak';
  const longestRange = streak.longestStreak.count > 0
    ? formatDateRange(streak.longestStreak.start, streak.longestStreak.end)
    : 'None';

  return `
<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${width} ${height}' width='${width}px' height='${height}px'>
  <style>
    @keyframes currstreak {
      0% { font-size: 3px; opacity: 0.2; }
      80% { font-size: 34px; opacity: 1; }
      100% { font-size: 28px; opacity: 1; }
    }
    @keyframes fadein {
      0% { opacity: 0; }
      100% { opacity: 1; }
    }
    .big-number {
      font-family: "Segoe UI", Ubuntu, -apple-system, sans-serif;
      font-weight: 700;
      font-size: 28px;
    }
    .stat-label {
      font-family: "Segoe UI", Ubuntu, -apple-system, sans-serif;
      font-weight: 400;
      font-size: 14px;
    }
    .stat-range {
      font-family: "Segoe UI", Ubuntu, -apple-system, sans-serif;
      font-weight: 400;
      font-size: 12px;
    }
  </style>

  <defs>
    <clipPath id='outer_clip'>
      <rect width='${width}' height='${height}' rx='${borderRadius}'/>
    </clipPath>
    <mask id='mask_out_ring_behind_fire'>
      <rect width='${width}' height='${height}' fill='white'/>
      <ellipse cx='247.5' cy='32' rx='13' ry='18' fill='black'/>
    </mask>
  </defs>

  <g clip-path='url(#outer_clip)'>
    <!-- Background -->
    <rect fill='${theme.bg}' rx='${borderRadius}' x='0.5' y='0.5' width='${width - 1}' height='${height - 1}' ${strokeAttr}/>

    <!-- Divisores -->
    <line x1='165' y1='28' x2='165' y2='170' stroke='${theme.border}' stroke-width='1' />
    <line x1='330' y1='28' x2='330' y2='170' stroke='${theme.border}' stroke-width='1' />

    <!-- 1. TOTAL CONTRIBUTIONS -->
    <g transform='translate(82.5, 48)'>
      <text class='big-number' x='0' y='32' text-anchor='middle' fill='${theme.title}'>
        ${streak.totalContributions.toLocaleString()}
      </text>
    </g>
    <g transform='translate(82.5, 84)'>
      <text class='stat-label' x='0' y='32' text-anchor='middle' fill='${theme.text}'>
        Total Contributions
      </text>
    </g>
    <g transform='translate(82.5, 114)'>
      <text class='stat-range' x='0' y='32' text-anchor='middle' fill='${theme.subtext}'>
        ${totalRange}
      </text>
    </g>

    <!-- 2. CURRENT STREAK (COM ANEL E FOGO CLÁSSICO) -->
    <!-- Círculo / Ring ao redor do número -->
    <g mask='url(#mask_out_ring_behind_fire)'>
      <circle cx='247.5' cy='71' r='40' fill='none' stroke='${activeRing}' stroke-width='5' />
    </g>

    <!-- Fogo oficial com corte no anel -->
    <g transform='translate(247.5, 19.5)'>
      <path d='M -12 -0.5 L 15 -0.5 L 15 23.5 L -12 23.5 L -12 -0.5 Z' fill='none'/>
      <path d='M 1.5 0.67 C 1.5 0.67 2.24 3.32 2.24 5.47 C 2.24 7.53 0.89 9.2 -1.17 9.2 C -3.23 9.2 -4.79 7.53 -4.79 5.47 L -4.76 5.11 C -6.78 7.51 -8 10.62 -8 13.99 C -8 18.41 -4.42 22 0 22 C 4.42 22 8 18.41 8 13.99 C 8 8.6 5.41 3.79 1.5 0.67 Z M -0.29 19 C -2.07 19 -3.51 17.6 -3.51 15.86 C -3.51 14.24 -2.46 13.1 -0.7 12.74 C 1.07 12.38 2.9 11.53 3.92 10.16 C 4.31 11.45 4.51 12.81 4.51 14.2 C 4.51 16.85 2.36 19 -0.29 19 Z' fill='${activeFire}'/>
    </g>

    <!-- Número do Streak -->
    <g transform='translate(247.5, 48)'>
      <text class='big-number' x='0' y='32' text-anchor='middle' fill='${theme.icon}' style='animation: currstreak 0.6s linear forwards'>
        ${streak.currentStreak.count}
      </text>
    </g>

    <!-- Label Current Streak -->
    <g transform='translate(247.5, 108)'>
      <text class='stat-label' x='0' y='32' text-anchor='middle' fill='${theme.icon}' font-weight='700'>
        Current Streak
      </text>
    </g>

    <!-- Range Current Streak -->
    <g transform='translate(247.5, 145)'>
      <text class='stat-range' x='0' y='21' text-anchor='middle' fill='${theme.subtext}'>
        ${currentRange}
      </text>
    </g>

    <!-- 3. LONGEST STREAK -->
    <g transform='translate(412.5, 48)'>
      <text class='big-number' x='0' y='32' text-anchor='middle' fill='${theme.title}'>
        ${streak.longestStreak.count}
      </text>
    </g>
    <g transform='translate(412.5, 84)'>
      <text class='stat-label' x='0' y='32' text-anchor='middle' fill='${theme.text}'>
        Longest Streak
      </text>
    </g>
    <g transform='translate(412.5, 114)'>
      <text class='stat-range' x='0' y='32' text-anchor='middle' fill='${theme.subtext}'>
        ${longestRange}
      </text>
    </g>
  </g>
</svg>
  `.trim();
}
