import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */

export default defineConfig({
  plugins: [react(), viteCommonjs()],
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
})




