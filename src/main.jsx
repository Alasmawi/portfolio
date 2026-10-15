import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// Self-hosted, and imported here so they go through the bundler and land on the
// same origin as everything else. These used to be a render-blocking stylesheet
// from fonts.googleapis.com — on a page whose whole loading strategy is "don't
// gate first paint on a third-party host".
//
// Only what is actually used. Archivo is the variable cut with its width axis
// (62% to 125%) as well as weight, because the design sets headlines condensed
// and labels wide from the one family. JetBrains Mono is latin-only at 400 and
// 500.
import '@fontsource-variable/archivo/wdth.css'
import '@fontsource/jetbrains-mono/latin-400.css'
import '@fontsource/jetbrains-mono/latin-500.css'

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
