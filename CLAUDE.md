# Working on this project

A single-page portfolio at `/v2`. React 19, Vite, Tailwind, Framer Motion,
three.js for the hero cloud, `@xyflow/react` for the K9 diagram. One page, seven
sections, no router, no server.

Read this before changing anything visual. Most of it is a rule that exists
because the opposite shipped once and had to be found in a screenshot.

## Run it

```bash
npm run dev            # vite, at /v2/
npm run build          # dist/
npm run preview        # serve the build
npm run lint           # oxlint
```

## Check it

Run these before every commit that touches colour, layout or the section
scaffolding. They are fast and they all read the real source, not a copy.

```bash
node scripts/check-tokens.mjs     # :root in index.css == tailwind.config.js, and no retired hexes
node scripts/check-contrast.mjs   # every token pairing against its WCAG floor
node scripts/check-shift.mjs      # the lazy covers reserve their boxes; the dialog doesn't move the page
node scripts/shots.mjs            # screenshots at 390 / 768 / 1440 + runtime probes
```

`shots.mjs` needs a build first. It uses the Chromium in the image at
`/opt/pw-browsers/chromium-1194/chrome-linux/chrome` — pass `executablePath`,
never run `playwright install`.

## The design system

### The glass rule

Two classes, one job each, and they do not mix.

| | `.glass-control` | `.glass-pane` |
|---|---|---|
| Is | an object you operate | a surface that holds something |
| Used on | nav pill, dock, buttons, badges, toggles | panes holding a diagram, a photo, copy |
| Has | thick tint, `saturate(205%)`, a masked refraction ring, a specular band, a pointer highlight | one `blur(14px)`, low tint, hairline edge, no rim |

A heavy rim at pane scale fights the figure inside it, and object treatment on
something a reader is reading is the effect competing with the text. If you find
yourself wanting a control's shine on a pane, the answer is that the pane is
doing too much.

`@apply` cannot compose a control. It copies a class's own declarations and not
the `::before`/`::after` rules attached to it, so an `@apply`-ed
`.glass-control` comes out flat. Compose in the markup: `className="btn
btn-ghost glass-control"`.

### The palette

`tailwind.config.js` is the source of truth and carries plain hex, because
`check-contrast.mjs` does WCAG arithmetic on those values and `var(--x)` is not
a number. `:root` in `src/index.css` mirrors it for hand-written CSS and inline
styles. `check-tokens.mjs` fails the two out of sync.

Burgundy is the **ground**, not an accent. It measures 1.6–1.8:1 against
anything it could sit behind, so it cannot signal. Rose (`--accent`, `#e2607e`)
signals. Amber is the gateway in the K9 diagram and nothing else. Teal is
status and nothing else — it is the only cool colour on the page and that is
what makes "live" read as live.

**Never write a colour literal in a component.** Use a Tailwind token class, or
`var(--token)` in an inline style. Every palette bug this project has had came
in as loose hex inside a `style={{}}`, survived a full repaint of
`tailwind.config.js`, and was found months later in a screenshot. Tailwind
arbitrary values count: `shadow-[inset_0_0_0_1px_rgb(226_96_126_/_0.7)]` is a
colour literal and `check-tokens.mjs` watches for the retired ones in that form
too.

### Rhythm and headings

Sections do not set their own padding. Three classes in `index.css`:

- `.section` — the outer `<section>`, all gutters and vertical padding
- `.section-inner` — the one `max-w-6xl` container everything hangs off
- `.section-body` — the gap between a heading block and what it introduces

Nothing else. When a section picks its own numbers, adjacent sections end up
128px apart in one place and 160px in the next, and on a page that draws no
lines between sections the gap is the only thing saying one has ended.

Every section opens with `<SectionHeading label title lede? size? />`. That
component is the only place the eyebrow-and-headline shape is written. `size="lead"`
exists for About and should stay that way.

### Motion

`MotionConfig reducedMotion="user"` in `App.jsx` covers everything Framer
animates. CSS-driven motion carries its own `prefers-reduced-motion` block —
if you add a keyframe animation, add the block in the same edit.

Animate `transform`, `opacity`, `border-radius` and registered custom
properties. Nothing else composites.

The atmosphere is one `position: fixed`, `contain: strict` layer for the whole
document, not gradients per section. Fixed means it never repaints on scroll and
the parallax is free. Keep it that way.

## Copy

- First person, plain prose. The page is Abdulla talking.
- No slash-separated labels (`Design / Build / Ship`), no noun stacks
  (`cloud infrastructure delivery optimisation`), no generic intensifiers
  (`seamlessly`, `robust`, `cutting-edge`).
- Every section headline is a sentence, not a noun. "Projects" under an eyebrow
  reading `// [ projects ]` is the same word twice.
- Don't open a sentence with a numeral — spell it (`spellCount` in
  `ProjectBrowser.jsx`).
- `src/data/*.js` is the source of truth for anything counted or listed. Never
  hard-code a number a data file can derive.
- The project descriptions in `projects.js` are Abdulla's own words. Don't
  rewrite them without asking.

## Accessibility floor

Non-negotiable, and `check-contrast.mjs` enforces the first two.

- Body text ≥ 4.5:1 on the ground it is *composited over*, not on `base.bg`.
- A border that identifies a component ≥ 3:1 (`base.edge`). A border that only
  separates things you read has no floor (`base.hairline`).
- Visible `:focus-visible` on everything operable.
- 44px minimum touch target.
- A decorative layer gets `aria-hidden` and `pointer-events-none`.

## Traps this project has actually hit

**Hand-written `-webkit-backdrop-filter`.** Don't. esbuild treats the prefixed
and standard properties as duplicate declarations of one property and keeps only
the last, so writing the prefix second deleted every unprefixed
`backdrop-filter` from the production build. Chromium dropped the `-webkit-`
alias, so the glass rendered flat in Chrome, Edge, Android and every in-app
WebView and only ever looked right in Safari. Autoprefixer emits it correctly.
`grep -c 'backdrop-filter:blur(14px)' dist/v2/assets/*.css` should print 2.

**`main` has `relative z-10`**, which is a stacking context, so a dialog
rendered inside it paints under the fixed nav and dock. Portal dialogs to
`document.body`.

**`scrollIntoView` scrolls every scrollable ancestor**, the document included.
For moving a horizontal row, use `row.scrollTo({ left })`, and skip it on first
render or the page jumps on load.

**`requestIdleCallback` with no timeout can be starved indefinitely.** The hero
cloud never mounted on busy pages. Always pass `{ timeout }`.

**`svh`, not `dvh`, for the hero.** `dvh` tracks the URL bar collapsing, so the
hero grew under the reader's thumb on the first flick of every visit.

**`overscroll-behavior-y: none` on `html`** is what keeps the fixed dock welded
to the bottom edge on iOS. Removing it un-sticks the primary navigation.

**`rect.top + window.scrollY` lies while a smooth scroll is easing.** `html` has
`scroll-behavior: smooth`, so a probe can read a rect from one frame against a
scroll position from another and report a layout shift that is not happening.
Walk `offsetTop` instead — it needs no scroll position.

**Probes rot faster than the page.** Three of the check scripts have at some
point measured an element that had been deleted and reported a clean pass.
When a layout changes, open the script that measures it in the same commit.

## Environment limits when verifying

- The bundled Chromium has no H.264, so the preview videos cannot be played
  back here. Verify posters, not playback.
- WebKit will not download through the egress policy, so anything iOS-specific
  is reasoned, not measured. Say which, in the commit message.
- Chromium's touch-gesture synthesis reports success and moves the page zero
  pixels. `shots.mjs` drives a wheel instead; thumb inertia is not measurable
  here.

## Commits

Conventional prefixes (`feat`, `fix`, `design`, `perf`, `docs`), one logical
change per commit, each independently revertable. Say what was wrong and what
the reader will now see, not what files moved. If something was reasoned rather
than measured, say so in the message.
