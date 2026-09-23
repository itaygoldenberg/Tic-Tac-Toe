import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AppRoutes from "../../app/AppRoutes";
import { COMPUTER_MOVE_DELAY_MS } from "../../game/game.constants";

// With Math.random fixed at 0.5 the computer always blocks, never plays randomly,
// takes the center first and otherwise the middle of the free corners — fully predictable.
function renderGame() {
    return render(
        <MemoryRouter initialEntries={["/game"]}>
            <AppRoutes />
        </MemoryRouter>
    );
}

function getCells() {
    return within(screen.getByRole("group", { name: "לוח המשחק" })).getAllByRole("button");
}

function cell(index: number) {
    return getCells()[index]!;
}

function cellValue(index: number) {
    return cell(index).getAttribute("aria-label")?.split(", ")[1];
}

function waitForComputer() {
    act(() => {
        vi.advanceTimersByTime(COMPUTER_MOVE_DELAY_MS);
    });
}

/** Plays the given cells in order, letting the computer answer after each one while the game is on. */
function playMoves(moves: number[]) {
    for (const move of moves) {
        fireEvent.click(cell(move));
        waitForComputer();
    }
}

function resultText() {
    return screen.getByRole("status").textContent;
}

beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.5);
});

afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
});

describe("game screen", () => {
    it("starts with an empty, playable board and no result", () => {
        renderGame();

        expect(getCells()).toHaveLength(9);
        getCells().forEach((button) => {
            expect(button).toBeEnabled();
            expect(button).toBeEmptyDOMElement();
        });
        expect(resultText()).toBe("");
    });

    it("places X on click and locks the board during the computer's turn", () => {
        renderGame();

        fireEvent.click(cell(0));

        expect(cellValue(0)).toBe("X");
        getCells().forEach((button) => expect(button).toBeDisabled());
    });

    it("ignores further clicks during the computer's turn", () => {
        renderGame();

        fireEvent.click(cell(0));
        fireEvent.click(cell(1));

        expect(cellValue(1)).toBe("ריק");
    });

    it("lets the computer answer with O after the delay and unlocks the board", () => {
        renderGame();
        fireEvent.click(cell(0));

        act(() => {
            vi.advanceTimersByTime(COMPUTER_MOVE_DELAY_MS - 1);
        });
        expect(cellValue(4)).toBe("ריק");

        act(() => {
            vi.advanceTimersByTime(1);
        });
        expect(cellValue(4)).toBe("O");
        expect(cell(1)).toBeEnabled();
        expect(cell(0)).toBeDisabled();
        expect(cell(4)).toBeDisabled();
    });

    it("shows a win message and locks the board when the player wins", () => {
        renderGame();

        // X0, O4, X8, O6, X2 (block), O1 (block), X5 → 2-5-8.
        playMoves([0, 8, 2, 5]);

        expect(resultText()).toBe("ניצחת!");
        getCells().forEach((button) => expect(button).toBeDisabled());
        expect([2, 5, 8].map(cellValue)).toEqual(["X", "X", "X"]);
    });

    it("shows a loss message when the computer wins", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.99); // never blocks

        renderGame();
        // X1, O4, X2, O8, X3, O0 → 0-4-8.
        playMoves([1, 2, 3]);

        expect(resultText()).toBe("הפסדת!");
        expect([0, 4, 8].map(cellValue)).toEqual(["O", "O", "O"]);
        getCells().forEach((button) => expect(button).toBeDisabled());
    });

    it("shows a draw message when the board fills without a winner", () => {
        renderGame();

        // X4, O6, X2, O8, X7, O1, X3, O5, X0 → full board, no line.
        playMoves([4, 2, 7, 3, 0]);

        expect(resultText()).toBe("תיקו!");
        getCells().forEach((button) => expect(button).toBeDisabled());
    });

    it("starts a new game with the player first", () => {
        renderGame();
        playMoves([0, 8, 2, 5]);
        expect(resultText()).toBe("ניצחת!");

        fireEvent.click(screen.getByRole("button", { name: "משחק חדש" }));

        expect(resultText()).toBe("");
        getCells().forEach((button) => {
            expect(button).toBeEnabled();
            expect(button).toBeEmptyDOMElement();
        });
    });

    it("cancels a pending computer move on New Game", () => {
        renderGame();
        fireEvent.click(cell(0));

        fireEvent.click(screen.getByRole("button", { name: "משחק חדש" }));
        waitForComputer();

        getCells().forEach((button) => expect(button).toBeEmptyDOMElement());
    });

    it("resets the game when leaving the screen, even mid computer turn", () => {
        const consoleError = vi.spyOn(console, "error");
        renderGame();
        fireEvent.click(cell(0));

        fireEvent.click(screen.getByRole("link", { name: "אודות" }));
        waitForComputer();
        fireEvent.click(screen.getByRole("link", { name: "משחק" }));

        getCells().forEach((button) => {
            expect(button).toBeEnabled();
            expect(button).toBeEmptyDOMElement();
        });
        expect(consoleError).not.toHaveBeenCalled();
    });
});
