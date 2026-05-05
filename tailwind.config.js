/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: '#040406',
        card: '#0A0C0F',
        elevated: '#0C0E11',
        terminal: '#12141A',
        'border-default': '#1A1D24',
        'text-primary': '#F0F1F2',
        'text-secondary': '#8C94A1',
        'accent-mint': '#66D9A5',
        'accent-mint-light': '#BFD9C7',
        'text-light': '#F5F7FA',
        'text-accent': '#66D9A5',
        'text-gray': '#8A8F98',
        'border-gray': '#262B33',
      },
      fontFamily: {
        hero: ['"Articulat CF"', 'system-ui', 'sans-serif'],
        title: ['"Articulat CF"', 'system-ui', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        terminal: ['"JetBrains Mono"', 'monospace'],
      },
      fontSize: {
        hero: ['64px', { lineHeight: '72px' }],
        title: ['44px', { lineHeight: '52px' }],
        body: ['16px', { lineHeight: '26px' }],
        terminal: ['13px'],
      },
      fontWeight: {
        '400': '400',
        '500': '500',
        '600': '600',
        '700': '700',
      },
    },
  },
  plugins: [],
}
