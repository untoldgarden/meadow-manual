// Playwright configuration
module.exports = {
  testDir: './tests/e2e',
  timeout: 30000,
  retries: 1,
  workers: process.env.CI ? 1 : undefined,
  
  use: {
    baseURL: 'http://localhost:4000',
    headless: true,
    viewport: { width: 1280, height: 720 },
    ignoreHTTPSErrors: true,
    video: 'retain-on-failure',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },

  projects: [
    {
      name: 'chromium',
      use: { browserName: 'chromium' }
    },
    {
      name: 'firefox',
      use: { browserName: 'firefox' }
    },
    {
      name: 'webkit',
      use: { browserName: 'webkit' }
    }
  ],

  webServer: {
    command: 'bundle exec jekyll serve',
    port: 4000,
    timeout: 120 * 1000,
    reuseExistingServer: !process.env.CI
  }
};