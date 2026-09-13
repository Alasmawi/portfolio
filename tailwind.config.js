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
          bg: '#1c0810',
          surface: '#2c0f1a',
          // Two border tiers, doing two different jobs.
          //
          // `edge` bounds things you can operate — inputs, ghost buttons, the
          // unselected chip. WCAG 1.4.11 asks 3:1 of a boundary that is what
          // identifies a component: #866a73 measures 3.68 / 3.45 / 3.29 against
          // bg / the composited card fill / surface.
          //
          // `hairline` separates things you only read — pane edges, dividers.
          // 1.4.11 does not ask 3:1 of those, and meeting it here would mean
          // outlining every glass pane in something a step off the accent,
          // which is exactly the heavy rim the glass rule says to keep off
          // panes. 1.72 on bg: an edge, not a frame.
          edge: '#866a73',
          hairline: '#4e2e39',
        },
        void: '#120509',
        text: {
          primary: '#fbeef0',
          muted: '#c0a6ad',
          dim: '#a98d95',
        },
        // Rose is the accent — the one colour that signals. Amber is the
        // secondary, reserved for the primary call to action and the gateway
        // in the K9 diagram, so "amber" always means "this is the hop
        // everything passes through".
        accent: {
          DEFAULT: '#e2607e',
          bright: '#fbd3dc',
          body: '#f09db0',
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
          'radial-gradient(circle, rgba(251,238,240,0.08) 1px, transparent 1px)',
      },
      boxShadow: {
        'glow-accent': '0 0 0 1px rgba(226,96,126,0.5), 0 0 24px rgba(226,96,126,0.18)',
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
