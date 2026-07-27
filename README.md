# Portfolio — Abdulla Alasmawi

A single-page portfolio site for a Cloud Computing / AWS / IoT / Backend developer, built with React, Vite, Tailwind CSS, and Framer Motion. Styled around a "cloud infrastructure" aesthetic — a top-light-to-bottom-dark gradient sky, an animated AWS-cloud/code "rain" backdrop, mono-labeled sections, and a GitHub-repo-style project browser.

Live sections: Hero, About, Experience, Projects (browsable, GIF/architecture previews), Skills, Education, Contact.

## Stack

- React (functional components, hooks)
- Vite
- Tailwind CSS (custom theme in `tailwind.config.js`)
- Framer Motion (scroll reveals, hero typing effect, project-browser transitions)
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
    Hero.jsx, About.jsx, Experience.jsx, ProjectBrowser.jsx,
    Skills.jsx, Education.jsx, Contact.jsx, Nav.jsx
    ui/
      CloudCodeRain.jsx    — fixed full-page falling AWS-cloud/code background
      CloudHorizon.jsx     — static cloud skyline banner at the top of the hero
      SkyDrift.jsx         — slow drifting clouds behind the hero name/tagline
      CloudShapes.jsx      — shared cloud SVG shapes (tech + soft cloud)
      CodeSnippet.jsx      — hand-rolled syntax-highlighted code block
      AwsIcon.jsx           — small glyph chips for the Cloud & AI skills group
      ArchitectureDiagram.jsx, SectionHeader.jsx, StatusBadge.jsx, Reveal.jsx, BrandIcons.jsx
  data/
    projects.js  — every project shown in the Projects browser
  hooks/
    useTypingEffect.js
public/
  gifs/          — project demo GIFs, referenced from data/projects.js
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
