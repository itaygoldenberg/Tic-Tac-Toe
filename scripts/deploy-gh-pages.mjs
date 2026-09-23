// Builds the app for GitHub Pages and publishes dist/ to the `gh-pages` branch of `origin`.
// Usage: npm run deploy:pages
//
// GitHub Pages serves a project site under /<repo-name>/ and has no SPA rewrites, so:
// - the build uses that sub-path as its base (router, manifest and service worker follow it);
// - index.html is copied to 404.html so deep links such as /<repo>/game still load the app.

import { execSync } from "node:child_process";
import { copyFileSync, rmSync, writeFileSync } from "node:fs";

const DIST = "dist";

function run(command, options = {}) {
    execSync(command, { stdio: "inherit", ...options });
}

function output(command) {
    return execSync(command).toString().trim();
}

const remote = output("git remote get-url origin");
const repoName = remote.match(/\/([^/]+?)(?:\.git)?$/)?.[1];
if (!repoName) throw new Error(`Cannot read the repository name from "${remote}"`);

const basePath = `/${repoName}/`;
const sourceCommit = output("git rev-parse --short HEAD");

console.log(`Building for GitHub Pages with base ${basePath}`);
run("npm run build", { env: { ...process.env, BASE_PATH: basePath } });

copyFileSync(`${DIST}/index.html`, `${DIST}/404.html`);
writeFileSync(`${DIST}/.nojekyll`, ""); // serve files as-is, without Jekyll processing

// dist/ is a throwaway build folder: publish it as a single fresh commit on gh-pages.
try {
    run("git init -q -b gh-pages", { cwd: DIST });
    run("git add -A", { cwd: DIST });
    run(`git commit -q -m "Deploy ${sourceCommit} to GitHub Pages"`, { cwd: DIST });
    run(`git push -f "${remote}" gh-pages`, { cwd: DIST });
} finally {
    rmSync(`${DIST}/.git`, { recursive: true, force: true });
}

const owner = remote.match(/[/:]([^/:]+)\/[^/]+?(?:\.git)?$/)?.[1];
console.log(`\nPublished. Site: https://${owner?.toLowerCase()}.github.io${basePath}`);
