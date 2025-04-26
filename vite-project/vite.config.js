
// vite.config.js
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
// vite.config.ts
resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@libs', replacement: path.resolve(__dirname, 'src/lib') }
      
    ]
  }

export default defineConfig({
plugins: [
tailwindcss(),
],
});