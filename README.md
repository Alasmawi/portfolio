# Portfolio — Abdulla Alasmawi

A single-page portfolio site built with React, Vite, Tailwind CSS and Framer Motion, served at `/v2`. Systems-diagram furniture — mono labels, status dots, a GitHub-style repo browser, a real architecture diagram — on a warm dusk ground under glass.

Live sections: Hero, Focus, Projects (browsable, video/architecture previews), Experience, Education, About, Contact.

## Design system

Two things carry the look, and both are in `src/index.css`.

**The glass rule.** Two effects, split by job, and never mixed:

| | `.glass-control` (liquid) | `.glass-pane` (flat) |
|---|---|---|
| Reads as | a physical object | a surface |
| Used on | nav pill, dock, buttons, filter chips, badges | large panes holding diagrams and copy |
| Recipe | thick tint, `saturate(205%) brightness(1.07)`, masked inner ring, specular top stroke, travelling highlight | one `blur(14px)`, low tint, hairline edge, no rim |

The cost sits with the control — a nested `backdrop-filter` behind a composited mask — so its ring renders only where the mask primitive is supported and only on pointer devices at `md` and up. Everything falls back to an opaque tint where `backdrop-filter` is missing entirely.

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
    Hero.jsx, FocusPillars.jsx, ProjectBrowser.jsx, Experience.jsx,
    Education.jsx, About.jsx, Contact.jsx, Nav.jsx
    ui/
      Atmosphere.jsx       — the fixed orb + grid layer behind the whole page
      HeroCloudCanvas.jsx  — three.js cloud on desktop, a build-time still on phones
      MobileTabBar.jsx     — the floating glass dock (phones only)
      K9Architecture.jsx, K9Flow.jsx  — the sensors → AWS diagram (lazy)
      RingGallery.jsx, HardwareStrip.jsx  — the K9 hardware photos
      CourseworkModule.jsx, ProgramJourney.jsx, ExpandTile.jsx
      ScrollCounter.jsx, Reveal.jsx, BrandIcons.jsx
  data/
    projects.js       — every project shown in the Projects browser
    focusPillars.js   — the four pillars; project counts are derived from projects.js
    experience.js, education.js, uobCoursework.js, rebootJourney.js, navLinks.js
  lib/
    mountCloud.js     — the hero cloud's three.js scene
    dna-helix.js      — the custom element in About
public/
  video/         — project preview clips, referenced from data/projects.js
```

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
  gif: '/gifs/my-project.gif', // drop the file in public/gifs/, or leave null for a "preview coming soon" placeholder
}
```

No layout changes are needed — the Projects section reads this array directly. GIFs are shown at their native aspect ratio (never cropped); keep individual files under ~5 MB where possible for fast loads.

## Deploying to Vercel

This is a static Vite build, so Vercel's zero-config detection handles it, and a `vercel.json` is included to pin the framework, build command, and output directory explicitly.

1. Push this repo to GitHub (or GitLab/Bitbucket).
2. In the [Vercel dashboard](https://vercel.com/new), click **Add New → Project** and import the repo.
3. Vercel will detect the Vite framework automatically (Build Command: `npm run build`, Output Directory: `dist`) — leave the defaults.
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
