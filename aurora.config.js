// @ts-check
const { defineAuroraConfig } = require('aurora-report');

module.exports = defineAuroraConfig({
  title: 'Sauce Demo — Shopify store',
  subtitle: 'End-to-end journeys for sauce-demo.myshopify.com',
  outputDir: 'aurora-report',
  // Every run is kept in its own folder, e.g. aurora-report/2026-09-20_16-32-08/.
  // aurora-report/index.html lists all of them, newest first.
  timestampedRuns: true,
  keepRuns: 30, // older run folders are deleted; set to 0 to keep everything
  open: 'never', // set to 'on-failure' if you want it to pop open locally

  theme: { mode: 'auto', accent: '#1f8a70' },

  capture: {
    stepScreenshots: 'on', // every step of every story gets a screenshot
    failureScreenshot: true,
    failureHtml: true,
    fullPage: false,
    video: 'retain-on-failure',
    trace: 'retain-on-failure',
    console: true,
    pageErrors: true,

    // Failed requests are recorded with the request that went out and the
    // response that came back — handy when a Shopify endpoint misbehaves.
    network: {
      requestBody: true,
      responseBody: true,
      maxBodySize: 4096,
      // A live Shopify store loads a lot of third-party tracking that fails
      // constantly and says nothing about the shop. Record only the store's
      // own traffic, then drop Shopify's own analytics beacons as well.
      include: ['sauce-demo.myshopify.com'],
      exclude: [
        '**/web-pixels**',
        '**/wpm@**',
        'monorail-edge.shopifysvc.com',
        /facebook\.com\/tr/,
        'google-analytics.com',
        'googletagmanager.com',
      ],
    },
  },

  charts: { trend: true, timeline: true, slowest: true, suites: true, failureReasons: true, projects: true },
  history: { enabled: true, keep: 30 },

  // The store is on the public internet, so pages are slower than a local app.
  slowTestThreshold: 20_000,

  links: {
    // report.issue('SHOP-42') becomes a link. Point this at your own tracker,
    // e.g. 'https://yourcompany.atlassian.net/browse/{id}'.
    issue: 'https://github.com/chinnu-82/sample_code_withReport/issues/{id}',
  },
});
