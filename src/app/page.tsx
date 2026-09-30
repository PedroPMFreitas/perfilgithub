'use client';

import { useState } from 'react';

export default function Home() {
  const [username, setUsername] = useState('PedroPMFreitas');
  const [theme, setTheme] = useState('gruvbox');
  const [copied, setCopied] = useState(false);

  // URLs geradas
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const streakUrl = `/api/streak?username=${username}&theme=${theme}&hide_border=true&border_radius=6`;
  const topLangsUrl = `/api/top-langs?username=${username}&theme=${theme}&hide_border=true&border_radius=6&layout=compact`;
  const statsUrl = `/api/stats?username=${username}&theme=${theme}&hide_border=true&border_radius=6`;
  const graphUrl = `/api/graph?username=${username}&theme=${theme}&hide_border=true&border_radius=6&custom_title=Contribution%20Graph`;

  const markdownSnippet = `<p align="center">
  <img src="${baseUrl}${streakUrl}" alt="GitHub Streak" />
</p>
<div align="center">
  <img src="${baseUrl}${topLangsUrl}" height="195" />
  <img src="${baseUrl}${statsUrl}" height="195" />
</div>
<p align="center">
  <img src="${baseUrl}${graphUrl}" alt="Contribution Graph - Last Year" />
</p>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(markdownSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#1d2021] text-[#ebdbb2] p-6 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <header className="border-b border-[#3c3836] pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-[#fabd2f]">⚡ GitHub Stats API (Gruvbox)</h1>
            <p className="text-sm text-[#a89984] mt-1">
              Sua própria API serverless na Vercel para cartões do GitHub rápidos, estáveis e sem rate limits compartilhados.
            </p>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-xs px-3 py-1.5 rounded bg-[#32302f] border border-[#504945] hover:bg-[#3c3836] text-[#ebdbb2] self-start"
          >
            Vercel Ready
          </a>
        </header>

        {/* Controls */}
        <section className="bg-[#282828] border border-[#3c3836] rounded-lg p-5 flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#a89984] mb-1.5">
              GitHub Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-[#1d2021] border border-[#504945] rounded px-3 py-2 text-sm text-[#ebdbb2] focus:outline-none focus:border-[#fabd2f]"
            />
          </div>

          <div className="w-[180px]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#a89984] mb-1.5">
              Tema
            </label>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="w-full bg-[#1d2021] border border-[#504945] rounded px-3 py-2 text-sm text-[#ebdbb2] focus:outline-none focus:border-[#fabd2f]"
            >
              <option value="gruvbox">Gruvbox (Padrão)</option>
              <option value="gruvbox-hard">Gruvbox Hard</option>
              <option value="gruvbox-light">Gruvbox Light</option>
              <option value="tokyonight">Tokyo Night</option>
              <option value="catppuccin">Catppuccin</option>
              <option value="dracula">Dracula</option>
            </select>
          </div>

          <button
            onClick={handleCopy}
            className="px-5 py-2 rounded bg-[#fabd2f] text-[#282828] font-semibold text-sm hover:bg-[#d79921] transition shadow"
          >
            {copied ? '✓ Copiado!' : 'Copiar Markdown para o README'}
          </button>
        </section>

        {/* Live Previews */}
        <section className="space-y-6">
          <h2 className="text-xl font-bold text-[#8ec07c]">Pré-visualização dos Cards</h2>

          {/* 1. Streak Card */}
          <div className="space-y-2">
            <span className="text-xs uppercase font-mono text-[#a89984]">1. Streak Stats (/api/streak)</span>
            <div className="p-4 bg-[#282828] rounded-lg border border-[#3c3836] flex justify-center overflow-x-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={streakUrl} alt="Streak Preview" className="max-w-full h-auto" />
            </div>
          </div>

          {/* 2. Top Langs & Stats Cards */}
          <div className="space-y-2">
            <span className="text-xs uppercase font-mono text-[#a89984]">2. Top Langs &amp; Stats (/api/top-langs &amp; /api/stats)</span>
            <div className="p-4 bg-[#282828] rounded-lg border border-[#3c3836] flex flex-wrap justify-center gap-4 overflow-x-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={topLangsUrl} alt="Top Langs Preview" className="max-w-full h-auto" />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={statsUrl} alt="Stats Preview" className="max-w-full h-auto" />
            </div>
          </div>

          {/* 3. Activity Graph Card */}
          <div className="space-y-2">
            <span className="text-xs uppercase font-mono text-[#a89984]">3. Contribution Activity Graph (/api/graph)</span>
            <div className="p-4 bg-[#282828] rounded-lg border border-[#3c3836] flex justify-center overflow-x-auto">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={graphUrl} alt="Graph Preview" className="max-w-full h-auto" />
            </div>
          </div>
        </section>

        {/* Markdown Snippet Code Box */}
        <section className="bg-[#282828] border border-[#3c3836] rounded-lg p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#fabd2f]">Código Markdown gerado</h3>
            <button
              onClick={handleCopy}
              className="text-xs text-[#83a598] hover:text-[#8ec07c] underline"
            >
              {copied ? 'Copiado!' : 'Copiar'}
            </button>
          </div>
          <pre className="bg-[#1d2021] p-4 rounded text-xs text-[#ebdbb2] overflow-x-auto font-mono">
            {markdownSnippet}
          </pre>
        </section>
      </div>
    </div>
  );
}
