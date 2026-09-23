import { expect, test } from "@playwright/test";

const RESULTS = ["ניצחת!", "הפסדת!", "תיקו!"];

test("a full game can be played against the computer without network calls", async ({ page }) => {
    await page.goto("/game");

    // Same-origin static assets (e.g. lazily loaded fonts) are fine; API calls or external origins are not.
    const origin = new URL(page.url()).origin;
    const requests: string[] = [];
    page.on("request", (request) => {
        const isApiCall = ["fetch", "xhr", "websocket", "eventsource"].includes(request.resourceType());
        const isExternal = new URL(request.url()).origin !== origin;
        if (isApiCall || isExternal) requests.push(request.url());
    });

    const board = page.getByRole("group", { name: "לוח המשחק" });
    const result = page.getByRole("status");
    const emptyCells = board.getByRole("button", { name: /ריק$/ });

    await expect(result).toHaveText("");

    for (let turn = 0; turn < 5; turn++) {
        const xCountBefore = await board.getByRole("button", { name: /X$/ }).count();
        await emptyCells.first().click();

        await expect(board.getByRole("button", { name: /X$/ })).toHaveCount(xCountBefore + 1);
        // Right after the move the whole board is locked (computer's turn or game over).
        await expect(board.getByRole("button", { disabled: false })).toHaveCount(0);

        const resultText = (await result.textContent()) ?? "";
        if (RESULTS.includes(resultText)) break;

        // Either the computer answers and the board unlocks, or its move ends the game.
        await expect(async () => {
            const unlocked = await board.getByRole("button", { disabled: false }).count();
            const text = (await result.textContent()) ?? "";
            expect(unlocked > 0 || RESULTS.includes(text)).toBe(true);
        }).toPass();

        if (RESULTS.includes((await result.textContent()) ?? "")) break;
    }

    await expect(result).toHaveText(new RegExp(RESULTS.join("|")));
    await expect(board.getByRole("button", { disabled: false })).toHaveCount(0);

    await page.getByRole("button", { name: "משחק חדש" }).click();
    await expect(result).toHaveText("");
    await expect(emptyCells).toHaveCount(9);

    expect(requests).toEqual([]);
});
