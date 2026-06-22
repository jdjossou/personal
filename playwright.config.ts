import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'http://localhost:3000',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* The site's P3R water background is WebGL on a perpetual rAF loop and the
       screen transitions are animated SVG masks. Forcing reduced-motion both
       pauses the water (it renders a single static frame) and makes ScreenReveal
       skip its mask entirely — so the DOM settles immediately and tests are
       deterministic instead of racing the animation loop. */
    contextOptions: { reducedMotion: 'reduce' },
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        /* Avoid the headless GPU path hanging on the WebGL water canvas. */
        launchOptions: { args: ['--disable-gpu'] },
      },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Build and serve a production bundle before the tests run. Production is used
     (rather than `next dev`) because Turbopack's on-demand dev compile of the
     /projects route can stall; a prebuilt server has every route ready up front.
     An already-running server on the port is reused locally, so you can `npm run
     build && npm run start` once and re-run the tests against it. */
  webServer: {
    command: 'npm run build && npm run start',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 240_000,
  },
});
