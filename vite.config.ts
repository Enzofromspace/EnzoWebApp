import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react(), {
    name: 'markdown-loader',
    transform(code, id) {
      if (id.endsWith('.md?raw')) {
        return {
          code: `export default ${JSON.stringify(code.replace(/\r\n/g, '\n'))};`,
          map: null
        };
      }
    }
  }],
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
      },
    },
  },
  publicDir: 'public',
  optimizeDeps: {
    include: ['react', 'react-dom', '@pixi/react', 'pixi.js'],
  },
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.svg', '**/*.md'],
  json: {
    stringify: true
  }
}); 