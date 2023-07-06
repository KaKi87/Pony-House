import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { wasm } from '@rollup/plugin-wasm';
import { viteStaticCopy } from 'vite-plugin-static-copy';
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import inject from '@rollup/plugin-inject';
import { svgLoader } from './viteSvgLoader';

const copyFiles = {
  targets: [
    {
      src: 'public/404/404.html',
      dest: '',
    },
    {
      src: 'public/404/ipfs-404.html',
      dest: '',
    },
    {
      src: 'public/404/404.md',
      dest: '',
    },
    {
      src: 'public/404/matrix.js',
      dest: '',
    },
    {
      src: 'node_modules/web3/dist/web3.min.js',
      dest: 'public/js/',
    },
    {
      src: 'node_modules/@matrix-org/olm/olm.wasm',
      dest: '',
    },
    {
      src: '_redirects',
      dest: '',
    },
    {
      src: 'config.json',
      dest: '',
    },
    {
      src: 'public/res/android',
      dest: 'public/',
    },
    {
      src: 'public/res/png',
      dest: 'public/res/',
    },
    {
      src: 'public/favicon.ico',
      dest: 'public/',
    },
    {
      src: 'public/manifest.json',
      dest: '',
    },
    {
      src: 'public/img/page',
      dest: 'public/img/',
    },
    {
      src: 'public/img/default_avatar',
      dest: 'public/img/',
    },
    {
      src: 'public/img/404',
      dest: 'public/img/',
    },
    {
      src: 'src/i18/data',
      dest: 'public/i18/',
    }
  ],
}

export default defineConfig({
  appType: 'spa',
  publicDir: false,
  base: "",
  server: {
    port: 8469,
    host: true,
  },
  plugins: [
    viteStaticCopy(copyFiles),
    svgLoader(),
    wasm(),
    react(),
  ],
  optimizeDeps: {
    esbuildOptions: {
      define: {
        global: 'globalThis'
      },
      plugins: [
        // Enable esbuild polyfill plugins
        NodeGlobalsPolyfillPlugin({
          process: false,
          buffer: true,
        }),
      ]
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    copyPublicDir: false,
    rollupOptions: {
      plugins: [
        inject({ Buffer: ['buffer', 'Buffer'] })
      ]
    }
  },
});
