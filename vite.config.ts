import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(() => {
  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['apple-touch-icon.png', 'icon.svg'],
        manifest: {
          id: '/',
          name: 'MAYRA AI — Personal Companion',
          short_name: 'MAYRA AI',
          description: 'Your World, Your AI, Your Mayra. Intelligent Android personal AI companion powered by Google Gemini.',
          theme_color: '#070410',
          background_color: '#070410',
          display: 'standalone',
          orientation: 'portrait',
          start_url: '/',
          scope: '/',
          categories: ['productivity', 'utilities', 'entertainment'],
          icons: [
            {
              src: '/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          screenshots: [
            {
              src: '/screenshot-mobile.png',
              sizes: '512x512',
              type: 'image/png',
              form_factor: 'narrow',
              label: 'MAYRA AI Android Mobile Interface',
            },
            {
              src: '/screenshot-desktop.png',
              sizes: '512x512',
              type: 'image/png',
              form_factor: 'wide',
              label: 'MAYRA AI Fullscreen Cybernetic Studio',
            },
          ],
          shortcuts: [
            {
              name: 'Talk to Mayra',
              short_name: 'Talk',
              description: 'Start real-time voice conversation with Mayra',
              url: '/?view=assistant',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'Coding Studio',
              short_name: 'Code',
              description: 'Open full-stack code generator & HTML sandbox',
              url: '/?view=coding',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
            {
              name: 'YouTube Music',
              short_name: 'Music',
              description: 'Discover and play curated songs and beats',
              url: '/?view=youtube',
              icons: [{ src: '/pwa-192x192.png', sizes: '192x192' }],
            },
          ],
        },
        devOptions: {
          enabled: true,
          type: 'module',
        },
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
