import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The site is served from /v2, not the domain root. `base` prefixes every
  // URL Vite generates — the module and CSS tags it writes into index.html,
  // imported assets, and `import.meta.env.BASE_URL`.
  base: '/v2/',
  build: {
    // Build into dist/v2 so the filesystem layout matches the URL space. With
    // a plain `dist`, a request for /v2/assets/index-abc.js would look for
    // dist/v2/assets/... , find nothing, and fall through to the SPA rewrite —
    // which answers a JavaScript request with HTML. Vercel's outputDirectory
    // stays `dist`, so dist/v2/* is served at /v2/*.
    outDir: 'dist/v2',
  },
})
