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
          // Two border tiers, because they are asked to do two different jobs.
          //
          // `edge` bounds things you can operate — inputs, ghost buttons, the
          // unselected tab. WCAG 1.4.11 wants 3:1 for a boundary that is what
          // identifies a component, and the old single token was 1.31:1 on the
          // page ground and 1.21:1 on a card fill, so a field's outline was
          // effectively invisible. #6a6e80 measures 3.48 / 3.20 / 3.01 against
          // bg / the composited card fill / surface.
          //
          // `hairline` separates things you only read — card edges, dividers,
          // the rule between metadata. 1.4.11 does not ask 3:1 of those, and
          // meeting it would mean a line at #676e9a, one perceptual step off
          // the accent, outlining every card on the site. That spends the one
          // signalling colour on decoration. Lifted instead from 1.31 to 2.03
          // on bg, which is enough to read as an edge without competing.
          edge: '#6a6e80',
          hairline: '#454a66',
        },
        void: '#0f111c',
        text: {
          primary: '#e9e9ed',
          muted: '#a4a5b2',
          // 4.10:1 on surface before, which fails AA, and 3.62:1 on the
          // third ground this file used to carry. 5.49 / 5.04 / 4.74 now.
          dim: '#8e8f9b',
        },
        // The one accent — blurple. `bright`/`body` are the two accent-tinted
        // text steps Nocturne allows; raw `accent` never sits on body copy.
        accent: {
          DEFAULT: '#9184d9',
          bright: '#d2cefd',
          body: '#b9b1ec',
        },
        ok: '#9184d9',
      },
      fontFamily: {
        // 'Inter Variable' is the family name @fontsource-variable registers;
        // plain 'Inter' stays behind it for anyone who has it installed locally.
        sans: ['"Inter Variable"', '"Inter"', 'system-ui', 'sans-serif'],
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
