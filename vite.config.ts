import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import { VitePWA } from "vite-plugin-pwa";

const APP_BACKGROUND = "#0B0F1A";

export default defineConfig({
    plugins: [
        react(),
        // Service worker is generated at build time only; `npm run dev` runs without it.
        VitePWA({
            registerType: "autoUpdate",
            strategies: "generateSW",
            injectRegister: "script-defer",
            // Icons and favicons are already matched by workbox.globPatterns; avoid duplicate precache entries.
            includeManifestIcons: false,
            manifest: {
                id: "/",
                name: "איקס עיגול",
                short_name: "איקס עיגול",
                description: "משחק איקס־עיגול פשוט מול המחשב",
                lang: "he",
                dir: "rtl",
                start_url: "/",
                scope: "/",
                display: "standalone",
                theme_color: APP_BACKGROUND,
                background_color: APP_BACKGROUND,
                icons: [
                    { src: "/pwa-192x192.png", sizes: "192x192", type: "image/png" },
                    { src: "/pwa-512x512.png", sizes: "512x512", type: "image/png" },
                    { src: "/maskable-icon-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
                ]
            },
            workbox: {
                // Precache the whole app shell, including the self-hosted fonts and icons.
                globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
                // Deep links (/game, /about) are served the cached SPA shell when offline.
                navigateFallback: "index.html",
                cleanupOutdatedCaches: true,
                // Take control of the page on the very first visit, so it works offline without a reload.
                clientsClaim: true
            }
        })
    ],
    test: {
        environment: "jsdom",
        setupFiles: ["./src/test/setup.ts"],
        include: ["src/**/*.test.{ts,tsx}"]
    }
});
