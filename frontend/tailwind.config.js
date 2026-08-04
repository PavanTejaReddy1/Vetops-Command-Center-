/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Sora"', 'sans-serif'],
        body: ['"Inter"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      colors: {
        // Core surfaces — driven by CSS variables so light/dark themes stay in one place
        canvas: 'rgb(var(--color-canvas) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        'surface-raised': 'rgb(var(--color-surface-raised) / <alpha-value>)',
        border: 'rgb(var(--color-border) / <alpha-value>)',
        'border-strong': 'rgb(var(--color-border-strong) / <alpha-value>)',

        ink: {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          muted: 'rgb(var(--color-ink-muted) / <alpha-value>)',
          faint: 'rgb(var(--color-ink-faint) / <alpha-value>)',
        },

        // Brand — clinical teal, the operational "vital sign" color
        brand: {
          50: '#EAF6F5',
          100: '#CDEAE7',
          200: '#9AD5CF',
          300: '#63BDB4',
          400: '#35A297',
          500: '#0D7C73',
          600: '#0A655F',
          700: '#095C56',
          800: '#08423E',
          900: '#062E2B',
        },

        // Signal colors — mirror a vitals monitor: amber watch, rose critical, blue scheduled/info
        signal: {
          amber: {
            DEFAULT: '#E2A63B',
            soft: '#FBEED2',
            deep: '#8A5C13',
          },
          rose: {
            DEFAULT: '#D6455A',
            soft: '#FADCE1',
            deep: '#8C1F30',
          },
          blue: {
            DEFAULT: '#3B6E91',
            soft: '#DCE9F1',
            deep: '#204257',
          },
          success: {
            DEFAULT: '#2E9E6C',
            soft: '#D9F0E4',
            deep: '#1B5E40',
          },
        },
      },
      boxShadow: {
        xs: '0 1px 2px 0 rgb(15 27 26 / 0.04)',
        card: '0 1px 2px 0 rgb(15 27 26 / 0.04), 0 1px 1px 0 rgb(15 27 26 / 0.03)',
        raised: '0 4px 16px -4px rgb(15 27 26 / 0.10), 0 2px 6px -2px rgb(15 27 26 / 0.06)',
        popover: '0 12px 32px -8px rgb(15 27 26 / 0.18), 0 4px 12px -4px rgb(15 27 26 / 0.08)',
      },
      borderRadius: {
        md: '8px',
        lg: '12px',
        xl: '16px',
      },
      keyframes: {
        pulseLine: {
          '0%': { strokeDashoffset: '240' },
          '100%': { strokeDashoffset: '0' },
        },
        breathe: {
          '0%, 100%': { opacity: 0.5 },
          '50%': { opacity: 1 },
        },
        fadeUp: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        'pulse-line': 'pulseLine 2.4s linear infinite',
        breathe: 'breathe 1.6s ease-in-out infinite',
        'fade-up': 'fadeUp 0.28s ease-out',
      },
    },
  },
  plugins: [],
};
