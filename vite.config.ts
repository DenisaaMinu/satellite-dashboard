import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import cesiumModule from 'vite-plugin-cesium'

// vite-plugin-cesium's type file is written for CommonJS, so TypeScript thinks the function
// is at cesiumModule.default. When Vite runs, the import already is the function.
// This line works in both cases.
const cesium = typeof cesiumModule === 'function' ? cesiumModule : cesiumModule.default

// https://vite.dev/config/
export default defineConfig({
  // cesium(): copies Cesium's workers, images and CSS into the build (needed for the 3D globe)
  plugins: [react(), cesium()],
})
