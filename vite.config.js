import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */

export default defineConfig({
  plugins: [react(), nodePolyfills(), viteCommonjs()],
  optimizeDeps:{
    esbuildOptions:{
      plugins:[
        esbuildCommonjs(['react-calendar','react-date-picker']) 
      ]
    }
  },
  build: {
    target: ['chrome109', 'edge112', 'firefox102', 'safari15.6', 'ios15.6'],
  },
  define: {
    global: 'globalThis',
  },
})




