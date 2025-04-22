// @ts-check
import { defineConfig } from 'astro/config'

import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  integrations: [react()],
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
