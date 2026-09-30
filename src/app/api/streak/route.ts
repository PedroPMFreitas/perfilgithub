import { NextRequest } from 'next/server';
import { getGitHubStats } from '@/lib/github';
import { getTheme } from '@/lib/themes';
import { renderStreakCard } from '@/lib/render/streakCard';
import { renderErrorCard } from '@/lib/render/errorCard';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');
  const themeName = searchParams.get('theme') || 'gruvbox';
  const hideBorder = searchParams.get('hide_border') === 'true';
  const borderRadius = parseInt(searchParams.get('border_radius') || '6', 10);

  if (!username) {
    const errorSvg = renderErrorCard('Missing "username" query parameter.', themeName);
    return new Response(errorSvg, {
      status: 400,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  }

  try {
    const { streak } = await getGitHubStats(username);
    const theme = getTheme(themeName);
    const svg = renderStreakCard(streak, { theme, hideBorder, borderRadius });

    return new Response(svg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=1800, s-maxage=3600, stale-while-revalidate=86400',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error occurred';
    const errorSvg = renderErrorCard(message, themeName);
    return new Response(errorSvg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml; charset=utf-8',
        'Cache-Control': 'no-cache',
      },
    });
  }
}
