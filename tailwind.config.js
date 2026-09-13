/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Values live in src/index.css as channel triplets; see the note there
        // for why the accent is amber. `<alpha-value>` is what lets bg-accent/10
        // and border-accent/70 keep working against a custom property.
        base: {
          bg: 'rgb(var(--bg) / <alpha-value>)',
          surface: 'rgb(var(--surface) / <alpha-value>)',
          edge: 'rgb(var(--edge) / <alpha-value>)',
          hairline: 'rgb(var(--hairline) / <alpha-value>)',
        },
        void: 'rgb(var(--void) / <alpha-value>)',
        text: {
          primary: 'rgb(var(--text-primary) / <alpha-value>)',
          muted: 'rgb(var(--text-muted) / <alpha-value>)',
          dim: 'rgb(var(--text-dim) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent) / <alpha-value>)',
          bright: 'rgb(var(--accent-bright) / <alpha-value>)',
          body: 'rgb(var(--accent-body) / <alpha-value>)',
        },
      },
      fontFamily: {
        // 'Inter Variable' is the family name @fontsource-variable registers;
        // plain 'Inter' stays behind it for anyone who has it installed locally.
        sans: ['"Inter Variable"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'dot-grid':
          'radial-gradient(circle, rgb(var(--text-primary) / 0.08) 1px, transparent 1px)',
      },
      boxShadow: {
        'glow-accent':
          '0 0 0 1px rgb(var(--accent) / 0.5), 0 0 28px rgb(var(--accent) / 0.20)',
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
