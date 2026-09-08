/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Dusk. The rule Nocturne set — at most two grounds, elevation from an
        // edge rather than a third background tone — survives the repaint; only
        // the hues move. `base.bg` is the page ground, `void` the deeper ground
        // the hero and the dock sit on.
        base: {
          bg: '#17121a',
          surface: '#241c28',
          // Two border tiers, doing two different jobs.
          //
          // `edge` bounds things you can operate — inputs, ghost buttons, the
          // unselected chip. WCAG 1.4.11 asks 3:1 of a boundary that is what
          // identifies a component: #7a6b74 measures 3.68 / 3.45 / 3.29 against
          // bg / the composited card fill / surface.
          //
          // `hairline` separates things you only read — pane edges, dividers.
          // 1.4.11 does not ask 3:1 of those, and meeting it here would mean
          // outlining every glass pane in something a step off the accent,
          // which is exactly the heavy rim the glass rule says to keep off
          // panes. 1.72 on bg: an edge, not a frame.
          edge: '#7a6b74',
          hairline: '#453a48',
        },
        void: '#0d0a0f',
        text: {
          primary: '#fdf3f4',
          muted: '#b6a7ad',
          dim: '#9c8f96',
        },
        // Rose is the accent — the one colour that signals. Amber is the
        // secondary, reserved for the primary call to action and the gateway
        // in the K9 diagram, so "amber" always means "this is the hop
        // everything passes through".
        accent: {
          DEFAULT: '#e07a9a',
          bright: '#fbd0dc',
          body: '#f6a8bf',
        },
        amber: {
          DEFAULT: '#f0a448',
          bright: '#fbd7a4',
        },
        // Teal, spent on status and nothing else: the "available for work"
        // dot, the "live" marker on a project. It is the one cool colour in
        // the palette, which is what makes live read as live at a glance.
        // (Reboot's own brand teal in education.js is an institution's colour,
        // not this token — the two never appear in the same figure.)
        signal: '#4fd1c5',
        ok: '#4fd1c5',
      },
      fontFamily: {
        // 'Inter Variable' is the family name @fontsource-variable registers;
        // plain 'Inter' stays behind it for anyone who has it installed locally.
        sans: ['"Inter Variable"', '"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'ui-monospace', 'monospace'],
      },
      backgroundImage: {
        'dot-grid':
          'radial-gradient(circle, rgba(253,243,244,0.08) 1px, transparent 1px)',
      },
      boxShadow: {
        'glow-accent': '0 0 0 1px rgba(224,122,154,0.5), 0 0 24px rgba(224,122,154,0.18)',
        // The drop under a glass pane. Long, soft and almost black: it is what
        // separates the pane from the ground now that the border is a hairline.
        pane: '0 30px 62px -32px rgba(0,0,0,0.85)',
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
