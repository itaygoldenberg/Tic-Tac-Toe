import { describe, expect, it } from "vitest";
import { WINNING_LINES } from "./game.constants";
import {
    applyMove,
    createEmptyBoard,
    getAvailableMoves,
    getGameOutcome,
    getWinner,
    getWinningLine,
    isDraw,
    isValidMove
} from "./game.rules";
import type { Board, Player } from "./game.types";

/** Builds a board from a 9-character string: "X", "O" or "." for empty. */
function boardFrom(layout: string): Board {
    return layout.split("").map((char) => (char === "." ? null : char)) as Board;
}

function boardWithLine(line: readonly number[], player: Player): Board {
    let board = createEmptyBoard();
    for (const index of line) board = applyMove(board, index, player);
    return board;
}

describe("getWinningLine / getWinner", () => {
    it.each(WINNING_LINES.map((line) => [line.join("-"), line] as const))(
        "detects line %s for both players",
        (_, line) => {
            for (const player of ["X", "O"] as const) {
                const board = boardWithLine(line, player);
                expect(getWinningLine(board)).toEqual([...line]);
                expect(getWinner(board)).toBe(player);
            }
        }
    );

    it("returns null on an empty board", () => {
        expect(getWinningLine(createEmptyBoard())).toBeNull();
        expect(getWinner(createEmptyBoard())).toBeNull();
    });

    it("returns null on a partial board without three in a row", () => {
        const board = boardFrom("XO.XO.O.X");
        expect(getWinningLine(board)).toBeNull();
        expect(getWinner(board)).toBeNull();
    });
});

describe("isDraw", () => {
    it("is true for a full board without a winner", () => {
        expect(isDraw(boardFrom("XOXXOOOXX"))).toBe(true);
    });

    it("is false for a full board with a winner", () => {
        expect(isDraw(boardFrom("XXXOOXOXO"))).toBe(false);
    });

    it("is false for a board that is not full", () => {
        expect(isDraw(boardFrom("XOXXOOOX."))).toBe(false);
    });
});

describe("isValidMove", () => {
    const board = boardFrom("X...O....");

    it("accepts an empty cell", () => {
        expect(isValidMove(board, 1)).toBe(true);
    });

    it("rejects an occupied cell", () => {
        expect(isValidMove(board, 0)).toBe(false);
        expect(isValidMove(board, 4)).toBe(false);
    });

    it.each([-1, 9, 1.5, Number.NaN])("rejects the invalid index %s", (index) => {
        expect(isValidMove(board, index)).toBe(false);
    });
});

describe("getAvailableMoves", () => {
    it("lists only empty cells", () => {
        expect(getAvailableMoves(boardFrom("X...O...X"))).toEqual([1, 2, 3, 5, 6, 7]);
        expect(getAvailableMoves(boardFrom("XOXXOOOXX"))).toEqual([]);
    });
});

describe("applyMove", () => {
    it("returns a new board without mutating the original", () => {
        const board = createEmptyBoard();
        const next = applyMove(board, 3, "X");

        expect(next[3]).toBe("X");
        expect(board[3]).toBeNull();
        expect(next).not.toBe(board);
    });
});

describe("getGameOutcome", () => {
    it("reports a player win with the winning cells", () => {
        expect(getGameOutcome(boardFrom("XXXOO...."))).toEqual({
            status: "playerWon",
            winningCells: [0, 1, 2]
        });
    });

    it("reports a computer win with the winning cells", () => {
        expect(getGameOutcome(boardFrom("OXXXO...O"))).toEqual({
            status: "computerWon",
            winningCells: [0, 4, 8]
        });
    });

    it("reports a draw", () => {
        expect(getGameOutcome(boardFrom("XOXXOOOXX"))).toEqual({ status: "draw", winningCells: [] });
    });

    it("reports an ongoing game", () => {
        expect(getGameOutcome(boardFrom("X...O...."))).toEqual({ status: "playing", winningCells: [] });
    });
});
