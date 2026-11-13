import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./specs",
  outputDir: "./artifacts/test-results",
  reporter: [["list"], ["html", { outputFolder: "./artifacts/report", open: "never" }]],
  fullyParallel: false,
  workers: 1,
  retries: 0,
  timeout: 45_000,
  use: {
    baseURL: process.env.GRAVIFIRE_BASE_URL ?? "http://localhost:3000",
    browserName: "chromium",
    channel: "chrome",
    headless: true,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
    video: "retain-on-failure",
    viewport: { width: 1440, height: 1000 },
    ignoreHTTPSErrors: false,
  },
});
