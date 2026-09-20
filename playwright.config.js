// @ts-check
const { defineConfig, devices } = require('@playwright/test');
const { withAurora } = require('aurora-report');

const BASE_URL = process.env.BASE_URL || 'https://sauce-demo.myshopify.com';

module.exports = withAurora(
  defineConfig({
    testDir: './tests',
    fullyParallel: true,
    // This is a live third-party demo store — stay gentle with it.
    workers: 2,
    retries: process.env.CI ? 2 : 1,
    timeout: 60_000,
    expect: { timeout: 10_000 },
    reporter: [['list']],
    use: {
      baseURL: BASE_URL,
      actionTimeout: 15_000,
      navigationTimeout: 30_000,
      locale: 'en-GB',
    },
    projects: [
      {
        name: 'Desktop Chrome',
        use: { ...devices['Desktop Chrome'], viewport: { width: 1366, height: 900 } },
        grepInvert: /@responsive/,
      },
      {
        name: 'Mobile Chrome',
        use: { ...devices['Pixel 7'] },
        grep: /@responsive/,
      },
    ],
  }),
  {
    environment: {
      'Store under test': BASE_URL,
      Platform: 'Shopify (public demo store)',
      Currency: 'GBP (£)',
    },
  },
);
