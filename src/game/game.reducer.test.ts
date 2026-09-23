import { describe, expect, it } from "vitest";
import { createInitialGameState } from "./game.initial-state";
import { gameReducer } from "./game.reducer";
import type { Board, GameState } from "./game.types";

function boardFrom(layout: string): Board {
    return layout.split("").map((char) => (char === "." ? null : char)) as Board;
}

function stateWith(overrides: Partial<GameState>): GameState {
    return { ...createInitialGameState(), ...overrides };
}

describe("initial state", () => {
    it("starts with an empty board and the player's turn", () => {
        const state = createInitialGameState();
        expect(state.board.every((cell) => cell === null)).toBe(true);
        expect(state.status).toBe("playing");
        expect(state.isComputerTurn).toBe(false);
        expect(state.winningCells).toEqual([]);
    });
});

describe("PLAYER_MOVE", () => {
    it("places X and hands the turn to the computer", () => {
        const next = gameReducer(createInitialGameState(), { type: "PLAYER_MOVE", index: 4 });

        expect(next.board[4]).toBe("X");
        expect(next.isComputerTurn).toBe(true);
        expect(next.status).toBe("playing");
    });

    it("ignores an occupied cell", () => {
        const state = stateWith({ board: boardFrom("O........") });
        expect(gameReducer(state, { type: "PLAYER_MOVE", index: 0 })).toBe(state);
    });

    it("ignores an invalid index", () => {
        const state = createInitialGameState();
        expect(gameReducer(state, { type: "PLAYER_MOVE", index: 9 })).toBe(state);
        expect(gameReducer(state, { type: "PLAYER_MOVE", index: -1 })).toBe(state);
    });

    it("ignores moves during the computer's turn", () => {
        const state = stateWith({ board: boardFrom("X........"), isComputerTurn: true });
        expect(gameReducer(state, { type: "PLAYER_MOVE", index: 1 })).toBe(state);
    });

    it("ignores moves after the game is over", () => {
        const state = stateWith({ board: boardFrom("XXXOO...."), status: "playerWon", winningCells: [0, 1, 2] });
        expect(gameReducer(state, { type: "PLAYER_MOVE", index: 8 })).toBe(state);
    });

    it("detects a player win and keeps the board locked", () => {
        const state = stateWith({ board: boardFrom("XX.OO....") });
        const next = gameReducer(state, { type: "PLAYER_MOVE", index: 2 });

        expect(next.status).toBe("playerWon");
        expect(next.winningCells).toEqual([0, 1, 2]);
        expect(next.isComputerTurn).toBe(false);
    });

    it("detects a draw on the last move", () => {
        const state = stateWith({ board: boardFrom("XOXXOOOX.") });
        const next = gameReducer(state, { type: "PLAYER_MOVE", index: 8 });

        expect(next.status).toBe("draw");
        expect(next.winningCells).toEqual([]);
        expect(next.isComputerTurn).toBe(false);
    });
});

describe("COMPUTER_MOVE", () => {
    it("places O and gives the turn back to the player", () => {
        const state = stateWith({ board: boardFrom("X........"), isComputerTurn: true });
        const next = gameReducer(state, { type: "COMPUTER_MOVE", index: 4 });

        expect(next.board[4]).toBe("O");
        expect(next.isComputerTurn).toBe(false);
        expect(next.status).toBe("playing");
    });

    it("is ignored when it is not the computer's turn", () => {
        const state = stateWith({ board: boardFrom("X........") });
        expect(gameReducer(state, { type: "COMPUTER_MOVE", index: 4 })).toBe(state);
    });

    it("ignores an occupied cell", () => {
        const state = stateWith({ board: boardFrom("X........"), isComputerTurn: true });
        expect(gameReducer(state, { type: "COMPUTER_MOVE", index: 0 })).toBe(state);
    });

    it("detects a computer win", () => {
        const state = stateWith({ board: boardFrom("OXXXO...."), isComputerTurn: true });
        const next = gameReducer(state, { type: "COMPUTER_MOVE", index: 8 });

        expect(next.status).toBe("computerWon");
        expect(next.winningCells).toEqual([0, 4, 8]);
        expect(next.isComputerTurn).toBe(false);
    });
});

describe("NEW_GAME", () => {
    it("resets everything, with the player moving first again", () => {
        const state = stateWith({ board: boardFrom("XXXOO...."), status: "playerWon", winningCells: [0, 1, 2] });
        expect(gameReducer(state, { type: "NEW_GAME" })).toEqual(createInitialGameState());
    });
});
