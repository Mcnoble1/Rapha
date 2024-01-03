import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteCommonjs } from '@originjs/vite-plugin-commonjs'
import { esbuildCommonjs } from '@originjs/vite-plugin-commonjs'
import { nodePolyfills } from 'vite-plugin-node-polyfills'
import vitePluginRequire from "vite-plugin-require";

// https://vitejs.dev/config/
/** @type {import('vite').UserConfig} */

export default defineConfig({
  plugins: [react(), viteCommonjs()],
  // optimizeDeps:{
  //   include: ['@web5/credentials'],
  //   esbuildOptions:{
  //     plugins:[
  //       esbuildCommonjs(['@web5/credentials']) 
  //     ]
  //   }
  // },
  build: {
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
  // define: {
  //   global: 'globalThis',
  // },
})




