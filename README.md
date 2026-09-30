# ⚡ GitHub Stats & Streak API (Gruvbox)

Sua própria API serverless na Vercel para gerar cards de estatísticas, streak, linguagens e gráficos de atividade do GitHub no tema Gruvbox (e outros).

---

## 🚀 Como testar localmente

1. Abra o arquivo `.env.local` e coloque seu token gerado no GitHub:
   ```env
   GITHUB_TOKEN=ghp_seu_token_aqui
   ```

2. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

3. Acesse no navegador: [http://localhost:3000](http://localhost:3000)
   Você verá a interface interativa com a pré-visualização ao vivo dos 4 cartões e o snippet Markdown pronto para copiar.

---

## 🌐 Como fazer Deploy na Vercel

### Opção 1: Via GitHub (Recomendado)

1. Crie um repositório no seu GitHub (ex: `github-stats-api`) e suba este código:
   ```bash
   git add .
   git commit -m "feat: custom github stats api"
   git branch -M main
   git remote add origin https://github.com/PedroPMFreitas/github-stats-api.git
   git push -u origin main
   ```

2. Acesse [vercel.com](https://vercel.com) e clique em **Add New... > Project**.
3. Importe o repositório `github-stats-api`.
4. Em **Environment Variables**, adicione:
   - **Key:** `GITHUB_TOKEN`
   - **Value:** `ghp_seu_token_aqui`
5. Clique em **Deploy**.

### Opção 2: Via Vercel CLI

```bash
npx vercel
```
E adicione o secret:
```bash
npx vercel env add GITHUB_TOKEN
```

---

## 📡 Endpoints disponíveis

Todos os endpoints retornam imagens **SVG puras** (`image/svg+xml`) com headers de cache CDN da Vercel (`s-maxage=3600`):

| Endpoint | Descrição | Parâmetros |
| :--- | :--- | :--- |
| `/api/streak` | Current streak, Longest streak e total de contribuições | `username`, `theme`, `hide_border`, `border_radius` |
| `/api/stats` | Total Stars, Commits, PRs, Issues e Contributed to | `username`, `theme`, `hide_border`, `border_radius` |
| `/api/top-langs` | Barra e lista das linguagens mais usadas | `username`, `theme`, `hide_border`, `border_radius`, `layout` |
| `/api/graph` | Grade de atividade anual com tons Gruvbox | `username`, `theme`, `hide_border`, `border_radius`, `custom_title` |

### Temas suportados:
- `gruvbox` (Padrão)
- `gruvbox-hard`
- `gruvbox-light`
- `tokyonight`
- `catppuccin`
- `dracula`
