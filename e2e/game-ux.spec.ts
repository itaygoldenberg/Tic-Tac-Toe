import { expect, test, type Page } from "@playwright/test";

// Fixing Math.random makes the computer predictable: it always blocks, never plays randomly,
// takes the center first and otherwise the middle free corner.
test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
        Math.random = () => 0.5;
    });
});

function board(page: Page) {
    return page.getByRole("group", { name: "לוח המשחק" });
}

function muteButton(page: Page) {
    return page.getByRole("button", { name: "השתק צלילים" });
}

async function playCell(page: Page, cellNumber: number) {
    const oCount = await board(page).getByRole("button", { name: /O$/ }).count();
    await board(page).getByRole("button", { name: `תא ${cellNumber}, ריק` }).click();

    // Wait for the computer's answer unless the move ended the game.
    await expect(async () => {
        const answered = (await board(page).getByRole("button", { name: /O$/ }).count()) > oCount;
        const over = ((await page.getByRole("status").textContent()) ?? "") !== "";
        expect(answered || over).toBe(true);
    }).toPass();
}

test("winning highlights the three cells and draws the winning line", async ({ page }) => {
    await page.goto("/game");

    // X1, O5, X9, O7, X3 (block), O2 (block), X6 → cells 3-6-9.
    for (const cellNumber of [1, 9, 3, 6]) await playCell(page, cellNumber);

    await expect(page.getByRole("status")).toHaveText("ניצחת!");
    const winningCells = board(page).locator("[data-winning]");
    await expect(winningCells).toHaveCount(3);
    await expect(winningCells.nth(0)).toHaveAccessibleName("תא 3, X");
    await expect(winningCells.nth(1)).toHaveAccessibleName("תא 6, X");
    await expect(winningCells.nth(2)).toHaveAccessibleName("תא 9, X");
    await expect(board(page).locator(".winning-line")).toBeVisible();
});

test("mute persists across screens but resets on reload, without browser storage", async ({ page }) => {
    await page.goto("/game");
    await expect(muteButton(page)).toHaveAttribute("aria-pressed", "false");

    await muteButton(page).click();
    await expect(muteButton(page)).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("link", { name: "אודות", exact: true }).click();
    await page.getByRole("link", { name: "משחק", exact: true }).click();
    await expect(muteButton(page)).toHaveAttribute("aria-pressed", "true");

    await playCell(page, 1);

    const storageSizes = await page.evaluate(() => [localStorage.length, sessionStorage.length]);
    expect(storageSizes).toEqual([0, 0]);

    await page.reload();
    await expect(muteButton(page)).toHaveAttribute("aria-pressed", "false");
});

test("the game can be played with the keyboard", async ({ page }) => {
    await page.goto("/game");

    const firstCell = board(page).getByRole("button", { name: "תא 1, ריק" });
    await firstCell.focus();
    await page.keyboard.press("Enter");

    await expect(board(page).getByRole("button", { name: "תא 1, X" })).toBeVisible();
    await expect(board(page).getByRole("button", { name: "תא 5, O" })).toBeVisible();

    await muteButton(page).focus();
    await page.keyboard.press("Space");
    await expect(muteButton(page)).toHaveAttribute("aria-pressed", "true");

    await page.getByRole("button", { name: "משחק חדש" }).focus();
    await page.keyboard.press("Enter");
    await expect(board(page).getByRole("button", { name: /ריק$/ })).toHaveCount(9);
});
