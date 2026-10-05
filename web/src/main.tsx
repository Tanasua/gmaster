import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Шрифти вбудовані в застосунок — без звернень до сторонніх серверів
import '@fontsource/pt-serif/400.css'
import '@fontsource/pt-serif/700.css'
import '@fontsource/manrope/400.css'
import '@fontsource/manrope/500.css'
import '@fontsource/manrope/600.css'
import '@fontsource/manrope/700.css'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
