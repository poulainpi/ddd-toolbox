// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  site: 'https://dddtoolbox.com',
  integrations: [react(), sitemap()],
  compressHTML: true,
  build: {
    inlineStylesheets: 'auto',
    format: 'file',
  },
  vite: {
    plugins: [tailwindcss()],
    server: {
      fs: {
        allow: ['../..'],
      },
    },
    ssr: {
      // https://docs.astro.build/en/guides/troubleshooting/#adding-dependencies-to-astro-in-a-monorepo
      noExternal: ['@astrojs/react', '@astrolib/seo'],
    },
  },
})
