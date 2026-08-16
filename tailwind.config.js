/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: {
          bg: '#0A0E15',
          surface: '#0D131C',
          raised: '#131B27',
          border: '#1E2836',
        },
        text: {
          primary: '#EAF0F6',
          muted: '#94A3B3',
          dim: '#5E6B7A',
        },
        amber: {
          DEFAULT: '#F2A93B',
          bright: '#FFC168',
          dim: '#8A6423',
        },
        steel: {
          DEFAULT: '#2FC2E8',
          bright: '#6FE3FF',
          dim: '#1B5670',
        },
        ok: '#3FB950',
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'dot-grid':
          'radial-gradient(circle, rgba(234,240,246,0.08) 1px, transparent 1px)',
      },
      boxShadow: {
        'glow-amber': '0 0 0 1px rgba(242,169,59,0.4), 0 0 24px rgba(242,169,59,0.15)',
        'glow-steel': '0 0 0 1px rgba(47,194,232,0.4), 0 0 24px rgba(47,194,232,0.18)',
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
