import { act, fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import AppRoutes from "../../app/AppRoutes";
import { COMPUTER_MOVE_DELAY_MS } from "../../game/game.constants";
import { audioService } from "../../services/audio.service";
import { FakeAudioContext, resetFakeAudio, totalOscillators } from "../../test/fake-audio-context";

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

function muteButton() {
    return screen.getByRole("button", { name: "השתק צלילים" });
}

function spyOnSounds() {
    return {
        x: vi.spyOn(audioService, "playX"),
        o: vi.spyOn(audioService, "playO"),
        win: vi.spyOn(audioService, "playWin"),
        lose: vi.spyOn(audioService, "playLose"),
        draw: vi.spyOn(audioService, "playDraw")
    };
}

beforeEach(() => {
    vi.useFakeTimers();
    vi.spyOn(Math, "random").mockReturnValue(0.5);
    vi.stubGlobal("AudioContext", FakeAudioContext);
    resetFakeAudio();
    audioService.setMuted(false);
});

afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
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

describe("visual feedback", () => {
    it("animates newly placed X and O marks", () => {
        const { container } = renderGame();

        fireEvent.click(cell(0));
        waitForComputer();

        expect(cell(0).querySelector("svg")).toHaveClass("mark--x", "mark--animated");
        expect(cell(4).querySelector("svg")).toHaveClass("mark--o", "mark--animated");
        expect(container.querySelector(".decorative-board")).toBeNull();
    });

    it("highlights exactly the three winning cells and draws the winning line", () => {
        const { container } = renderGame();
        playMoves([0, 8, 2, 5]);

        const winning = getCells().filter((button) => button.hasAttribute("data-winning"));
        expect(winning.map((button) => getCells().indexOf(button))).toEqual([2, 5, 8]);
        expect(container.querySelector(".winning-line")).toHaveAttribute("data-cells", "2,5,8");
    });

    it("highlights the computer's winning line on a loss", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.99);
        const { container } = renderGame();
        playMoves([1, 2, 3]);

        expect(container.querySelector(".winning-line")).toHaveAttribute("data-cells", "0,4,8");
    });

    it("shows no highlight during play or on a draw", () => {
        const { container } = renderGame();

        fireEvent.click(cell(4));
        expect(container.querySelector(".winning-line")).toBeNull();

        waitForComputer();
        playMoves([2, 7, 3, 0]);
        expect(resultText()).toBe("תיקו!");
        expect(container.querySelector(".winning-line")).toBeNull();
        expect(container.querySelector("[data-winning]")).toBeNull();
    });

    it("never shows a turn indicator", () => {
        renderGame();
        const turnText = /התור שלך|המחשב חושב/;

        expect(screen.queryByText(turnText)).toBeNull();
        fireEvent.click(cell(0));
        expect(screen.queryByText(turnText)).toBeNull();
        waitForComputer();
        expect(screen.queryByText(turnText)).toBeNull();
    });
});

describe("sound effects", () => {
    it("plays the X sound on the player's move and the O sound on the computer's move", () => {
        const sounds = spyOnSounds();
        renderGame();

        fireEvent.click(cell(0));
        expect(sounds.x).toHaveBeenCalledTimes(1);
        expect(sounds.o).not.toHaveBeenCalled();

        waitForComputer();
        expect(sounds.o).toHaveBeenCalledTimes(1);
        expect(totalOscillators()).toBeGreaterThan(0);
    });

    it("plays the win sound when the player wins", () => {
        const sounds = spyOnSounds();
        renderGame();
        playMoves([0, 8, 2, 5]);

        expect(sounds.win).toHaveBeenCalledTimes(1);
        expect(sounds.lose).not.toHaveBeenCalled();
        expect(sounds.draw).not.toHaveBeenCalled();
    });

    it("plays the lose sound when the computer wins", () => {
        vi.spyOn(Math, "random").mockReturnValue(0.99);
        const sounds = spyOnSounds();
        renderGame();
        playMoves([1, 2, 3]);

        expect(sounds.lose).toHaveBeenCalledTimes(1);
        expect(sounds.win).not.toHaveBeenCalled();
    });

    it("plays the draw sound on a draw", () => {
        const sounds = spyOnSounds();
        renderGame();
        playMoves([4, 2, 7, 3, 0]);

        expect(sounds.draw).toHaveBeenCalledTimes(1);
        expect(sounds.win).not.toHaveBeenCalled();
        expect(sounds.lose).not.toHaveBeenCalled();
    });

    it("plays no sound on New Game", () => {
        renderGame();
        playMoves([0, 8, 2, 5]);
        const sounds = spyOnSounds();

        fireEvent.click(screen.getByRole("button", { name: "משחק חדש" }));

        Object.values(sounds).forEach((spy) => expect(spy).not.toHaveBeenCalled());
    });
});

describe("mute", () => {
    it("starts with sound on", () => {
        renderGame();
        expect(muteButton()).toHaveAttribute("aria-pressed", "false");
    });

    it("silences every effect while muted and restores sound on unmute", () => {
        renderGame();

        fireEvent.click(muteButton());
        expect(muteButton()).toHaveAttribute("aria-pressed", "true");

        playMoves([0, 8, 2, 5]);
        expect(resultText()).toBe("ניצחת!");
        expect(totalOscillators()).toBe(0);

        fireEvent.click(muteButton());
        expect(muteButton()).toHaveAttribute("aria-pressed", "false");

        fireEvent.click(screen.getByRole("button", { name: "משחק חדש" }));
        fireEvent.click(cell(0));
        expect(totalOscillators()).toBeGreaterThan(0);
    });

    it("keeps the mute choice when leaving and returning to the game screen", () => {
        renderGame();
        fireEvent.click(muteButton());

        fireEvent.click(screen.getByRole("link", { name: "בית" }));
        fireEvent.click(screen.getByRole("link", { name: "משחק" }));

        expect(muteButton()).toHaveAttribute("aria-pressed", "true");
    });

    it("keeps the mute choice on New Game", () => {
        renderGame();
        fireEvent.click(muteButton());

        fireEvent.click(screen.getByRole("button", { name: "משחק חדש" }));

        expect(muteButton()).toHaveAttribute("aria-pressed", "true");
    });

    it("does not touch browser storage", () => {
        const setItem = vi.spyOn(Storage.prototype, "setItem");
        renderGame();

        fireEvent.click(muteButton());
        playMoves([0, 8, 2, 5]);

        expect(setItem).not.toHaveBeenCalled();
        expect(localStorage.length).toBe(0);
        expect(sessionStorage.length).toBe(0);
    });
});
