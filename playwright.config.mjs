import { defineConfig } from '@playwright/test';

// Browser checks run against the production build served by `astro preview`.
export default defineConfig({
  testDir: './tests',
  testMatch: 'browser.spec.mjs',
  timeout: 30_000,
  reporter: 'list',
  use: { baseURL: 'http://localhost:4321' },
  webServer: {
    command: 'npm run build && npm run preview',
    url: 'http://localhost:4321/',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
