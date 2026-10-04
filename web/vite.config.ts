import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// base './' — щоб статична збірка працювала з будь-якого шляху (GitHub Pages тощо)
export default defineConfig({
  base: './',
  plugins: [react()],
})
