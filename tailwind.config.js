/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    // Square. The design has no rounded panels, so every radius utility
    // resolves to nothing; `full` stays, for the handful of true circles
    // (status dots, the language dot).
    borderRadius: {
      none: '0',
      sm: '0',
      DEFAULT: '0',
      md: '0',
      lg: '0',
      xl: '0',
      '2xl': '0',
      '3xl': '0',
      full: '9999px',
    },
    extend: {
      colors: {
        // Three grounds: ink, bone, carmine. See index.css.
        ink: { DEFAULT: '#0e0f12', raised: '#15171c' },
        bone: '#efe9dd',
        carmine: '#b0122b',
        base: {
          bg: '#0e0f12',
          surface: '#15171c',
          // `edge` bounds things you can operate and clears 3:1 on ink;
          // `hairline` separates things you only read.
          edge: '#7b7d86',
          hairline: '#2c2e35',
        },
        void: '#08090b',
        text: {
          primary: '#efe9dd',
          muted: '#a3a4ab',
          dim: '#8d8f98',
        },
        // Carmine is a ground, not a text colour: on ink it measures under
        // 3:1. `body` is the same hue lightened to 5.6:1 for text and thin
        // marks on ink; `bright` is its hover.
        accent: {
          DEFAULT: '#b0122b',
          bright: '#ff8394',
          body: '#f0506a',
        },
        // Kept for the K9 architecture diagram, where amber marks the gateway
        // every reading passes through.
        amber: {
          DEFAULT: '#f0a448',
          bright: '#fbd7a4',
        },
        signal: '#efe9dd',
        ok: '#efe9dd',
      },
      fontFamily: {
        sans: ['"Archivo Variable"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse-slow 2.4s ease-in-out infinite',
      },
      keyframes: {
        'pulse-slow': {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
      },
    },
  },
  plugins: [],
}
