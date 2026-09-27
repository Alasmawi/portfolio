import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // The site is served from the domain root. The frozen original lives at /v1
  // (see scripts/build-site.sh), and /v2 — where this build used to be served
  // while it was being finished — redirects here (vercel.json).
  base: '/',
})
