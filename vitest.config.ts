import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['**/*/vite.config.{ts,mts}', '**/*/vitest.config.{ts,mts}', '!vitest.config.ts'],
  },
})
