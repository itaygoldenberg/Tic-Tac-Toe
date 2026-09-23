import { expect, test, type Page } from "@playwright/test";

const ROUTES = [
    { path: "/", heading: "איקס עיגול", activeNav: "בית" },
    { path: "/game", heading: "איקס עיגול", activeNav: "משחק" },
    { path: "/about", heading: "אודות", activeNav: "אודות" }
] as const;

async function expectNoHorizontalScroll(page: Page) {
    const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth
    );
    expect(overflow).toBeLessThanOrEqual(0);
}

for (const route of ROUTES) {
    test(`direct navigation and reload work on ${route.path}`, async ({ page }) => {
        const response = await page.goto(route.path);
        expect(response?.status()).toBe(200);

        await expect(page.getByRole("heading", { level: 1 })).toHaveText(route.heading);
        await expect(page.getByRole("link", { name: route.activeNav, exact: true })).toHaveAttribute(
            "aria-current",
            "page"
        );
        await expectNoHorizontalScroll(page);

        await page.reload();
        await expect(page.getByRole("heading", { level: 1 })).toHaveText(route.heading);
    });
}

test("document is Hebrew and right-to-left", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator("html")).toHaveAttribute("lang", "he");
    await expect(page.locator("html")).toHaveAttribute("dir", "rtl");
});

test("user can move through all screens", async ({ page }) => {
    await page.goto("/");

    await page.getByRole("link", { name: "התחל לשחק" }).click();
    await expect(page).toHaveURL(/\/game$/);
    await expect(page.getByRole("group", { name: "לוח המשחק" }).getByRole("button")).toHaveCount(9);

    await page.getByRole("link", { name: "אודות", exact: true }).click();
    await expect(page).toHaveURL(/\/about$/);
    await expect(page.getByText("פותח על ידי איתי גולדנברג")).toBeVisible();

    await page.getByRole("link", { name: "בית", exact: true }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.getByRole("link", { name: "התחל לשחק" })).toBeVisible();
});
