export interface Theme {
  bg: string;
  title: string;
  text: string;
  subtext: string;
  icon: string;
  border: string;
  accent: string;
  fire: string;
}

export const themes: Record<string, Theme> = {
  gruvbox: {
    bg: '#282828',
    title: '#fabd2f',
    text: '#ebdbb2',
    subtext: '#a89984',
    icon: '#fe8019',
    border: '#3c3836',
    accent: '#8ec07c',
    fire: '#fb4934',
  },
  'gruvbox-hard': {
    bg: '#1d2021',
    title: '#fabd2f',
    text: '#ebdbb2',
    subtext: '#928374',
    icon: '#fe8019',
    border: '#3c3836',
    accent: '#b8bb26',
    fire: '#fb4934',
  },
  'gruvbox-light': {
    bg: '#fbf1c7',
    title: '#b57614',
    text: '#3c3836',
    subtext: '#7c6f64',
    icon: '#af3a03',
    border: '#d5c4a1',
    accent: '#427b58',
    fire: '#9d0006',
  },
  tokyonight: {
    bg: '#1a1b26',
    title: '#7aa2f7',
    text: '#c0caf5',
    subtext: '#565f89',
    icon: '#bb9af7',
    border: '#24283b',
    accent: '#7dcfff',
    fire: '#f7768e',
  },
  catppuccin: {
    bg: '#1e1e2e',
    title: '#cba6f7',
    text: '#cdd6f4',
    subtext: '#6c7086',
    icon: '#fab387',
    border: '#313244',
    accent: '#89dceb',
    fire: '#f38ba8',
  },
  dracula: {
    bg: '#282a36',
    title: '#bd93f9',
    text: '#f8f8f2',
    subtext: '#6272a4',
    icon: '#ff79c6',
    border: '#44475a',
    accent: '#8be9fd',
    fire: '#ff5555',
  },
};

export function getTheme(name?: string | null): Theme {
  if (!name) return themes.gruvbox;
  return themes[name.toLowerCase()] || themes.gruvbox;
}
