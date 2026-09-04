import { defineConfig, devices } from "@playwright/test";

const PORT = 3100;
const BASE_URL = `http://localhost:${PORT}`;

// Assumes the docs-cloak backend is already running and reachable at
// NEXT_PUBLIC_API_URL (defaults to http://localhost:3000) — see README.md's
// "Running the e2e suite" section and .github/workflows/e2e.yml for how CI starts it.
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    // Only set for environments (e.g. a pinned local browser cache) that need a
    // specific Chromium binary instead of Playwright's own managed install. Unset in
    // CI and normal local runs, where Playwright resolves the browser itself.
    launchOptions: process.env.PLAYWRIGHT_TEST_EXECUTABLE_PATH
      ? { executablePath: process.env.PLAYWRIGHT_TEST_EXECUTABLE_PATH }
      : undefined,
  },
  webServer: {
    command: `npm run dev -- -p ${PORT}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3000",
      // Lowered for the e2e suite's oversized-file test so it doesn't need to
      // generate/upload a real 25MB file to exercise the limit.
      NEXT_PUBLIC_MAX_UPLOAD_BYTES: process.env.NEXT_PUBLIC_MAX_UPLOAD_BYTES ?? "2000",
    },
  },
  // A single desktop project by default; tests/e2e/mobile.spec.ts opts into a mobile
  // viewport itself via test.use(), rather than a second project that would re-run the
  // entire suite twice.
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
