import { getTheme } from '../themes';

export function renderErrorCard(message: string, themeName?: string): string {
  const theme = getTheme(themeName);
  const width = 450;
  const height = 120;

  return `
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
  <style>
    .title {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 14px;
      font-weight: 700;
      fill: ${theme.fire};
    }
    .text {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      font-size: 12px;
      fill: ${theme.text};
    }
  </style>
  <rect x="0.5" y="0.5" width="${width - 1}" height="${height - 1}" rx="6" fill="${theme.bg}" stroke="${theme.fire}" stroke-width="1" />
  <text class="title" x="20" y="40">⚠️ Something went wrong</text>
  <text class="text" x="20" y="70">${message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</text>
</svg>
  `.trim();
}
