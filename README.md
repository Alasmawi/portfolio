# Portfolio — Abdulla Alasmawi

A single-page portfolio built with React, Vite, Tailwind CSS and Framer Motion, served at the root of alasmawi.dev. Systems-diagram furniture — mono labels, status dots, a trace-style data path in the hero, drawn architecture diagrams — on a warm dusk ground under glass.

Sections, in order: Hero, What I do, Work, Experience, Skills, Education, About, Contact. The previous site is kept, frozen, at `/v1`; `/v2/*` (where this build lived while it was being finished) redirects permanently to `/`.

The CV (`public/Abdulla_Alasmawi_CV.pdf`) carries the same roles, bullets, projects and skills as `src/data/`. Change one, change the other.

## Design system

Two things carry the look, and both are in `src/index.css`.

**The glass rule.** Two effects, split by job, and never mixed:

| | `.glass-control` (liquid) | `.glass-pane` (flat) |
|---|---|---|
| Reads as | a physical object | a surface |
| Used on | nav pill, dock, buttons, filter chips, badges | large panes holding diagrams and copy |
| Recipe | thick tint, `saturate(205%) brightness(1.07)`, masked inner ring, specular top stroke, travelling highlight | one `blur(14px)`, low tint, hairline edge, no rim |

The cost sits with the control — a nested `backdrop-filter` behind a composited mask — so its ring renders only where the mask primitive is supported and only on pointer devices at `md` and up. Everything falls back to an opaque tint where `backdrop-filter` is missing entirely.

**The hero's data path.** `ui/HeroTrace.jsx` draws one real flow through K9 Pavlov, Bayyan and Guidely in turn, as a trace waterfall, from `src/data/traces.js`. Bar positions set order and overlap only; the panel prints no timings.

**The atmosphere.** `Atmosphere.jsx` paints four drifting orbs and a 72px grid in one `position: fixed`, `contain: strict` layer for the whole document, instead of each section carrying its own gradients. Fixed means it never repaints on scroll, and the parallax comes free. Two of the four orbs are desktop-only.

Palette: ground `#17121a`, deeper `#0d0a0f`, cream `#fdf3f4`, rose `#e07a9a` (the accent), amber `#f0a448` (calls to action, and the gateway in the K9 diagram), teal `#4fd1c5` (status, nothing else). `node scripts/check-contrast.mjs` reads the tokens out of `tailwind.config.js` and fails if any pairing drops below its WCAG floor.

## Stack

- React (functional components, hooks)
- Vite
- Tailwind CSS (custom theme in `tailwind.config.js`)
- Framer Motion (scroll reveals, project-browser transitions)
- lucide-react (icons)

## Local development

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build     # outputs to dist/
npm run preview   # serve the production build locally
```

## Project structure

```
src/
  components/
    Hero.jsx, FocusPillars.jsx, ProjectBrowser.jsx, Experience.jsx, Skills.jsx,
    Education.jsx, About.jsx, Contact.jsx, Nav.jsx
    ui/
      SectionHeader.jsx    — the shared section header, and the frame every section sits in
      HeroTrace.jsx        — the hero's data-path panel
      Atmosphere.jsx       — the fixed orb + grid layer behind the whole page
      MobileTabBar.jsx     — the floating glass dock (below lg)
      K9Architecture.jsx, K9Flow.jsx  — the sensors → AWS diagram (lazy)
      BayyanArchitecture.jsx          — Bayyan's deployment diagram
      RingGallery.jsx, HardwareStrip.jsx  — the K9 hardware photos
      CourseworkModule.jsx, ProgramJourney.jsx, Reveal.jsx, BrandIcons.jsx
  data/
    projects.js       — every project; `featured` ones get the large cards
    experience.js     — roles, bullets, and the project each role produced
    skills.js         — the toolbox, grouped as on the CV
    focusPillars.js   — the four kinds of work and the evidence for each
    traces.js         — the hero's data paths
    education.js, uobCoursework.js, rebootJourney.js, navLinks.js
  lib/
    openProject.js    — opens a project's dialog from anywhere on the page
public/
  Abdulla_Alasmawi_CV.pdf   — the CV behind every "Download CV" link
  video/                    — project preview clips, referenced from data/projects.js
scripts/
  build-site.sh        — builds the site and adds the frozen /v1
  make-og.mjs          — renders public/og.png, the link-preview card
  make-bayyan-cover.mjs — renders Bayyan's drawn card cover
  make-posters.mjs, check-contrast.mjs, check-shift.mjs, shots.mjs
```

## Contact form

Messages are sent through [Web3Forms](https://web3forms.com). Create an access key there with the inbox you want messages delivered to, then add it in Vercel under **Settings → Environment Variables** as `VITE_WEB3FORMS_KEY` and redeploy. The key is public by design — it can only send to that one inbox. Without it, Send falls back to opening a drafted email in the visitor's mail app.

### Bayyan screenshots

Bayyan is an internal system, so its card shows a drawn cover and its dialog shows an architecture diagram. Once screenshots are cleared for sharing, drop them in `src/assets/bayyan/`, import them in `projects.js`, and add them to Bayyan's `items` (same shape as K9's); the dialog then shows a **Screens** tab beside the diagram. Point `poster` at one of them to replace the cover.

### Adding or updating a project

Edit `src/data/projects.js` — each entry is one object:

```js
{
  id: 'my-project',
  name: 'My Project',
  tagline: 'one line description',
  language: 'Go',            // used for the language dot; add new colors to LANGUAGE_COLORS
  description: '...',
  tags: ['Go', 'Docker'],
  githubUrl: 'https://github.com/Alasmawi/my-project',
  liveUrl: null,              // optional
  video: asset('/video/my-project.mp4'),     // run scripts/make-posters.mjs for the poster
  poster: asset('/video/posters/my-project.webp'),
}
```

No layout changes are needed — the Projects section reads this array directly. Add `featured: true` with a `context`, `summary` and three `proof` lines to promote a project to the large cards.

## Deploying to Vercel

This is a static Vite build, so Vercel's zero-config detection handles it, and a `vercel.json` is included to pin the framework, build command, and output directory explicitly.

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In the [Vercel dashboard](https://vercel.com/new), click **Add New → Project** and import the repo.
3. `vercel.json` pins the build (`npm run build:site`, output `dist`), the `/v1` rewrites and the `/v2` redirects — leave the dashboard defaults.
4. Click **Deploy**. You'll get a `*.vercel.app` URL once the build finishes.

## Connecting your custom domain

Once the project is deployed on Vercel:

1. Open the project in the Vercel dashboard → **Settings → Domains**.
2. Type your domain (e.g. `alasmawi.dev`) and click **Add**.
3. Vercel will show you DNS records to add at your domain registrar (wherever you bought the domain). You have two options:
   - **Recommended — apex/root domain (`alasmawi.dev`):** add an **A record** pointing `@` to `76.76.21.21`.
   - **Subdomain (e.g. `www.alasmawi.dev`):** add a **CNAME record** pointing `www` to `cname.vercel-dns.com`.
   - Alternative: instead of individual records, you can point your domain's **nameservers** to Vercel's (shown in the dashboard) and manage all DNS from Vercel — simpler if you don't need other DNS records at that registrar.
4. Go to your domain registrar's DNS settings (GoDaddy, Namecheap, Google Domains, etc.), add the record(s) exactly as shown in Vercel.
5. Back in Vercel, wait for the domain status to flip to **Valid** — DNS propagation is usually minutes, but can take up to ~24-48 hours depending on your registrar's TTL.
6. Vercel automatically issues and renews an SSL certificate for the domain once it's verified — no extra steps needed.
7. If you want both the apex domain and `www` to work, add both and set one as a redirect to the other in the Domains panel (Vercel offers a one-click "redirect to" toggle).

Tip: if you're unsure which records to add, use the "Add Domain" flow in the dashboard first — Vercel inspects the domain and shows you the exact records for your specific registrar setup rather than a generic list.
