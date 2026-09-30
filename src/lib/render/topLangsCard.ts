import { LanguageStat } from '../github';
import { Theme } from '../themes';

interface TopLangsCardOptions {
  theme: Theme;
  hideBorder?: boolean;
  borderRadius?: number;
  layout?: 'compact' | 'normal';
}

export function renderTopLangsCard(languages: LanguageStat[], options: TopLangsCardOptions): string {
  const { theme, hideBorder = false, borderRadius = 6, layout = 'compact' } = options;

  const width = 350;
  const height = 195;
  const strokeAttr = hideBorder ? 'stroke="none"' : `stroke="${theme.border}" stroke-width="1"`;

  const barWidth = width - 50;
  const barHeight = 8;
  const barY = 56;

  // Montar barra de progresso segmentada
  let currentX = 25;
  const barSegments = languages.map((lang) => {
    const segWidth = (lang.percentage / 100) * barWidth;
    const rect = `<rect x="${currentX.toFixed(2)}" y="${barY}" width="${segWidth.toFixed(2)}" height="${barHeight}" fill="${lang.color}" />`;
    currentX += segWidth;
    return rect;
  }).join('');

  // Itens da legenda (distribuídos em 2 colunas para layout compacto)
  const itemsPerCol = Math.ceil(languages.length / 2);
  const legendItems = languages.map((lang, index) => {
    const col = index < itemsPerCol ? 0 : 1;
    const row = index % itemsPerCol;
    const x = col === 0 ? 25 : width / 2 + 10;
    const y = 88 + row * 24;

    return `
    <g transform="translate(${x}, ${y})">
      <circle cx="5" cy="5" r="5" fill="${lang.color}" />
      <text class="lang-name" x="18" y="9" fill="${theme.text}">${lang.name}</text>
      <text class="lang-pct" x="${col === 0 ? width / 2 - 25 : width - x - 25}" y="9" text-anchor="end" fill="${theme.subtext}">${lang.percentage.toFixed(1)}%</text>
    </g>
    `;
  }).join('');

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 17px;
      font-weight: 700;
      fill: ${theme.title};
    }
    .lang-name {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 12px;
      font-weight: 500;
    }
    .lang-pct {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 12px;
      font-weight: 400;
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
  <text class="title" x="25" y="36">Top Languages</text>
  
  <!-- Progress Bar Container -->
  <g clip-path="url(#progress-clip)">
    <defs>
      <clipPath id="progress-clip">
        <rect x="25" y="${barY}" width="${barWidth}" height="${barHeight}" rx="4" />
      </clipPath>
    </defs>
    ${barSegments}
  </g>

  <!-- Legend -->
  ${legendItems}
</svg>
  `.trim();
}
