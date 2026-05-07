/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      // ─── Color Palette ───────────────────────────────────────────
      colors: {
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E8D5A3',
          dark:    '#9A7A2E',
        },
        cream: {
          DEFAULT: '#FAF7F2',
          dark:    '#F0EAE0',
        },
        obsidian: {
          DEFAULT: '#0A0A0A',
          light:   '#1A1A1A',
          muted:   '#2A2A2A',
        },
      },
      // ─── Typography ──────────────────────────────────────────────
      fontFamily: {
        display: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        body:    ['"Jost"', 'sans-serif'],
        mono:    ['"DM Mono"', 'monospace'],
      },
      // ─── Spacing & Sizing ────────────────────────────────────────
      maxWidth: {
        '8xl': '88rem',
      },
      // ─── Animation ───────────────────────────────────────────────
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2s infinite linear',
        fadeUp:  'fadeUp 0.6s ease forwards',
      },
    },
  },
  plugins: [],
}
