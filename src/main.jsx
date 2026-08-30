import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted, and imported here so they go through the bundler and land on the
// same origin as everything else. These used to be a render-blocking stylesheet
// from fonts.googleapis.com — on a page whose whole loading strategy is "don't
// gate first paint on a third-party host".
//
// Only what is actually used. Inter is the variable cut, which covers the 400,
// 500 and 600 the site selects in one file rather than three; its @font-face
// blocks carry unicode-range, so a browser fetches the latin subset and ignores
// the rest. JetBrains Mono is latin-only at 400 and 500. The old link asked for
// seven faces: Inter 700 and JetBrains Mono 600 were never selected by anything.
import '@fontsource-variable/inter/wght.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-500.css'

import './index.css'
import './lib/dna-helix.js'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
