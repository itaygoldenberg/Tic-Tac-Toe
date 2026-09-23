import { expect, type Page } from "@playwright/test";

/**
 * Fixing Math.random makes the computer predictable: it always blocks, never plays randomly,
 * takes the center first and otherwise the middle free corner.
 */
export async function makeComputerPredictable(page: Page) {
    await page.addInitScript(() => {
        Math.random = () => 0.5;
    });
}

/** With a predictable computer, playing these cells in order wins on cells 3-6-9. */
export const WINNING_SEQUENCE = [1, 9, 3, 6];

export function board(page: Page) {
    return page.getByRole("group", { name: "לוח המשחק" });
}

/** Clicks an empty cell (1-9) and waits for the computer's answer unless the move ended the game. */
export async function playCell(page: Page, cellNumber: number) {
    const oCount = await board(page).getByRole("button", { name: /O$/ }).count();
    await board(page).getByRole("button", { name: `תא ${cellNumber}, ריק` }).click();

    await expect(async () => {
        const answered = (await board(page).getByRole("button", { name: /O$/ }).count()) > oCount;
        const over = ((await page.getByRole("status").textContent()) ?? "") !== "";
        expect(answered || over).toBe(true);
    }).toPass();
}
