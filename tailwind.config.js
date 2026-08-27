/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Nocturne — max two grounds: `base.bg` is the page ground, `void` is
        // the deeper rain/hero ground. Surfaces are the same family lifted
        // only by a hairline edge, never a third ground color.
        base: {
          bg: '#161826',
          surface: '#232532',
          raised: '#2b2e3f',
          border: '#2b2e40',
        },
        void: '#0f111c',
        text: {
          primary: '#e9e9ed',
          muted: '#a4a5b2',
          dim: '#83848f',
        },
        // The one accent — blurple. `bright`/`body` are the two accent-tinted
        // text steps Nocturne allows; raw `accent` never sits on body copy.
        accent: {
          DEFAULT: '#9184d9',
          bright: '#d2cefd',
          body: '#b9b1ec',
          dim: '#5d5294',
        },
        ok: '#9184d9',
      },
      fontFamily: {
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'dot-grid':
          'radial-gradient(circle, rgba(233,233,237,0.08) 1px, transparent 1px)',
      },
      boxShadow: {
        'glow-accent': '0 0 0 1px rgba(145,132,217,0.5), 0 0 24px rgba(145,132,217,0.18)',
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
