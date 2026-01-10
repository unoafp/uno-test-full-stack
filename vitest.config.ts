/// <reference types="vitest" />
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  root: './frontend',
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './jest.setup.js',
  },
})