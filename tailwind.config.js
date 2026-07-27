/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#0B0F14',
          surface: '#0D1117',
          raised: '#111823',
          border: '#1C2530',
        },
        text: {
          primary: '#E6EDF3',
          muted: '#8B98A5',
          dim: '#5B6773',
        },
        amber: {
          DEFAULT: '#F2A93B',
          bright: '#FFB454',
          dim: '#8A6423',
        },
        steel: {
          DEFAULT: '#4FA3C4',
          bright: '#6FC3E4',
          dim: '#2C5A6E',
        },
        ok: '#3FB950',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'dot-grid':
          'radial-gradient(circle, rgba(230,237,243,0.08) 1px, transparent 1px)',
      },
      boxShadow: {
        'glow-amber': '0 0 0 1px rgba(242,169,59,0.4), 0 0 24px rgba(242,169,59,0.15)',
        'glow-steel': '0 0 0 1px rgba(79,163,196,0.4), 0 0 24px rgba(79,163,196,0.15)',
      },
      animation: {
        blink: 'blink 1.6s step-start infinite',
        'pulse-slow': 'pulse-slow 2.4s ease-in-out infinite',
      },
      keyframes: {
        blink: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.15 },
        },
        'pulse-slow': {
          '0%, 100%': { opacity: 0.6, transform: 'scale(1)' },
          '50%': { opacity: 1, transform: 'scale(1.15)' },
        },
      },
    },
  },
  plugins: [],
}
