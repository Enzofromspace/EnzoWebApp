import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  base: "/EnzoWebApp/",  // ✅ Ensure this is correct; should match your GitHub repo name

  plugins: [
    react(), 
    {
      name: 'markdown-loader',
      transform(code, id) {
        if (id.endsWith('.md?raw')) {
          const cleanContent = code
            .replace(/^export default /, '')
            .replace(/^["']|["']$/g, '')
            .replace(/\\n/g, '\n')
            .trim();
          return {
            code: `export default ${JSON.stringify(cleanContent)}`,
            map: null
          };
        }
      }
    }
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'react': path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom', '@pixi/react', 'pixi.js']
  },

  server: {
    port: 3000,
    open: true,
    watch: {
      usePolling: true,
    },
  },

  build: {
    outDir: 'dist',
    sourcemap: true,
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks: {
          'react': ['react', 'react-dom'],
          'pixi': ['pixi.js', '@pixi/react'],
          'tone': ['tone'],
          'gsap': ['gsap'],
        },
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && /\.(gif|jpe?g|png|svg)$/.test(assetInfo.name)) {
            return 'images/[name][extname]';
          }
          return 'assets/[name][extname]';
        }
      },
    },
    copyPublicDir: true
  },

  publicDir: 'public',

  optimizeDeps: {
    include: ['react', 'react-dom', '@pixi/react', 'pixi.js'],
  },

  assetsInclude: [
    '**/*.png', 
    '**/*.jpg', 
    '**/*.jpeg', 
    '**/*.gif', 
    '**/*.svg', 
    '**/*.md'  // ✅ Ensure Markdown files are included in assets
  ],

  json: {
    stringify: true
  }
});