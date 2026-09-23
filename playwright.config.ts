import { defineConfig, devices } from "@playwright/test";

const PORT = 4173;

export default defineConfig({
    testDir: "./e2e",
    fullyParallel: true,
    reporter: "list",
    use: {
        baseURL: `http://localhost:${PORT}`,
        trace: "on-first-retry"
    },
    projects: [
        {
            name: "desktop-chrome",
            use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } }
        },
        {
            name: "mobile-chrome",
            use: { ...devices["Pixel 7"] }
        }
    ],
    webServer: {
        command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
        url: `http://localhost:${PORT}`,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000
    }
});
