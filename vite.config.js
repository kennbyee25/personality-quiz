import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Served as a GitHub Project Page at /personality-quiz/. Gate the base path so
// local dev still serves from root.
export default defineConfig({
  base: process.env.GITHUB_PAGES ? '/personality-quiz/' : '/',
  plugins: [react()],
});
