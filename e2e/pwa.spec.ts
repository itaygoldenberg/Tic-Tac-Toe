import { expect, test, type Page } from "@playwright/test";
import { WINNING_SEQUENCE, board, makeComputerPredictable, playCell } from "./helpers";

/** Loads the app online and waits until the service worker is active and controls the page. */
async function installServiceWorker(page: Page) {
    await page.goto("/");
    await page.evaluate(async () => {
        await navigator.serviceWorker.ready;
    });
    await page.waitForFunction(() => navigator.serviceWorker.controller !== null);
}

/** Reads width and height from a PNG's IHDR chunk. */
function pngSize(png: Buffer) {
    return { width: png.readUInt32BE(16), height: png.readUInt32BE(20) };
}

test("the web app manifest has everything Chrome needs", async ({ page, request }) => {
    await page.goto("/");
    await expect(page.locator('link[rel="manifest"]')).toHaveAttribute("href", "/manifest.webmanifest");

    const response = await request.get("/manifest.webmanifest");
    expect(response.ok()).toBe(true);
    const manifest = await response.json();

    expect(manifest).toMatchObject({
        name: "איקס עיגול",
        short_name: "איקס עיגול",
        lang: "he",
        dir: "rtl",
        start_url: "/",
        display: "standalone",
        theme_color: "#0B0F1A",
        background_color: "#0B0F1A"
    });

    const sizes = manifest.icons.map((icon: { sizes: string }) => icon.sizes);
    expect(sizes).toEqual(expect.arrayContaining(["192x192", "512x512"]));
    expect(manifest.icons.some((icon: { purpose?: string }) => icon.purpose === "maskable")).toBe(true);

    for (const icon of manifest.icons as Array<{ src: string; sizes: string }>) {
        const iconResponse = await request.get(icon.src);
        expect(iconResponse.status(), icon.src).toBe(200);
        expect(iconResponse.headers()["content-type"]).toContain("image/png");
        const { width, height } = pngSize(await iconResponse.body());
        expect(`${width}x${height}`).toBe(icon.sizes);
    }
});

test("Chrome reports the app as installable", async ({ page }) => {
    await installServiceWorker(page);

    const cdp = await page.context().newCDPSession(page);
    const { installabilityErrors } = await cdp.send("Page.getInstallabilityErrors");

    expect(installabilityErrors).toEqual([]);
});

test("only the app shell is cached, never game data", async ({ page }) => {
    await installServiceWorker(page);

    const cache = await page.evaluate(async () => {
        const names = await caches.keys();
        const paths: string[] = [];
        for (const name of names) {
            const entries = await (await caches.open(name)).keys();
            paths.push(...entries.map((entry) => new URL(entry.url).pathname));
        }
        return { names, paths };
    });

    expect(cache.names.length).toBeGreaterThan(0);
    cache.names.forEach((name) => expect(name).toMatch(/^workbox-precache/));
    expect(cache.paths).toEqual(
        expect.arrayContaining(["/index.html", "/manifest.webmanifest", "/pwa-192x192.png", "/pwa-512x512.png"])
    );
    expect(cache.paths.some((path) => path.endsWith(".js"))).toBe(true);
    expect(cache.paths.some((path) => path.endsWith(".css"))).toBe(true);
    expect(cache.paths.filter((path) => path.endsWith(".woff2"))).toHaveLength(2);
    cache.paths.forEach((path) => expect(path).toMatch(/\.(html|js|css|png|svg|ico|woff2|webmanifest)$/));
});

test("all screens and a full game work offline after the first visit", async ({ page, context }) => {
    await makeComputerPredictable(page);
    await installServiceWorker(page);
    await context.setOffline(true);

    // Direct navigation to every route, served from the service worker cache.
    await page.goto("/");
    await expect(page.getByRole("link", { name: "התחל לשחק" })).toBeVisible();

    await page.goto("/about");
    await expect(page.getByText("פותח על ידי איתי גולדנברג")).toBeVisible();

    await page.goto("/game");
    await page.reload();
    await expect(board(page).getByRole("button")).toHaveCount(9);

    // The self-hosted font is available offline too.
    const fontLoaded = await page.evaluate(async () => {
        const faces = await document.fonts.load("700 16px Heebo", "איקס עיגול");
        return faces.length > 0 && faces.every((face) => face.status === "loaded");
    });
    expect(fontLoaded).toBe(true);

    // A complete game against the computer, including mute, without network.
    await page.getByRole("button", { name: "השתק צלילים" }).click();
    for (const cellNumber of WINNING_SEQUENCE) await playCell(page, cellNumber);
    await expect(page.getByRole("status")).toHaveText("ניצחת!");
    await expect(board(page).locator("[data-winning]")).toHaveCount(3);

    await page.getByRole("button", { name: "משחק חדש" }).click();
    await expect(board(page).getByRole("button", { name: /ריק$/ })).toHaveCount(9);

    // In-app navigation offline.
    await page.getByRole("link", { name: "בית", exact: true }).click();
    await expect(page.getByRole("link", { name: "התחל לשחק" })).toBeVisible();
});

test("there is no custom install button on any screen", async ({ page }) => {
    for (const path of ["/", "/game", "/about"]) {
        await page.goto(path);
        await expect(page.getByRole("button", { name: /התקן|התקנה|install/i })).toHaveCount(0);
        await expect(page.getByRole("link", { name: /התקן|התקנה|install/i })).toHaveCount(0);
    }
});
