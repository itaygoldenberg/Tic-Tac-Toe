// Generates the PWA icons and favicons in public/ from a single SVG design.
// Renders with Playwright's Chromium (already a dev dependency), so no image tooling is needed.
// Usage: npm run icons

import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";

const PUBLIC_DIR = new URL("../public/", import.meta.url);

/**
 * Neon X and O on the app background. All artwork stays inside the central 80% circle,
 * the "safe zone" that survives any maskable-icon crop.
 */
function iconSvg({ rounded }) {
    const corner = rounded ? 104 : 0;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <defs>
        <radialGradient id="bg" cx="50%" cy="35%" r="75%">
            <stop offset="0" stop-color="#14213d" />
            <stop offset="1" stop-color="#0B0F1A" />
        </radialGradient>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="9" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
    </defs>
    <rect width="512" height="512" rx="${corner}" fill="url(#bg)" />
    <g filter="url(#glow)" fill="none" stroke-linecap="round" stroke-width="30">
        <path d="M140 140 L236 236 M236 140 L140 236" stroke="#FF2D55" />
        <circle cx="324" cy="324" r="56" stroke="#00E5FF" />
    </g>
</svg>`;
}

/** Wraps a PNG in a single-image .ico container (PNG payloads are valid in ICO files). */
function pngToIco(png, size) {
    const header = Buffer.alloc(6);
    header.writeUInt16LE(0, 0); // reserved
    header.writeUInt16LE(1, 2); // type: icon
    header.writeUInt16LE(1, 4); // image count

    const entry = Buffer.alloc(16);
    entry.writeUInt8(size, 0); // width
    entry.writeUInt8(size, 1); // height
    entry.writeUInt8(0, 2); // palette colors
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bits per pixel
    entry.writeUInt32LE(png.length, 8); // image size
    entry.writeUInt32LE(header.length + entry.length, 12); // image offset

    return Buffer.concat([header, entry, png]);
}

const browser = await chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });

async function renderPng(svg, size) {
    await page.setViewportSize({ width: size, height: size });
    const sized = svg.replace("<svg ", `<svg width="${size}" height="${size}" `);
    await page.setContent(`<html><body style="margin:0;background:transparent">${sized}</body></html>`);
    return page.screenshot({ type: "png", omitBackground: true, clip: { x: 0, y: 0, width: size, height: size } });
}

const outputs = [
    { file: "pwa-192x192.png", size: 192, rounded: true },
    { file: "pwa-512x512.png", size: 512, rounded: true },
    { file: "maskable-icon-512x512.png", size: 512, rounded: false }
];

for (const { file, size, rounded } of outputs) {
    await writeFile(new URL(file, PUBLIC_DIR), await renderPng(iconSvg({ rounded }), size));
    console.log(`public/${file}`);
}

await writeFile(new URL("favicon.ico", PUBLIC_DIR), pngToIco(await renderPng(iconSvg({ rounded: true }), 32), 32));
console.log("public/favicon.ico");

await writeFile(new URL("favicon.svg", PUBLIC_DIR), `${iconSvg({ rounded: true })}\n`);
console.log("public/favicon.svg");

await browser.close();
