import { describe, expect, it } from "vitest";
import { chooseComputerMove, findWinningMove } from "./computer-player";
import { BLOCK_PROBABILITY, CORNER_INDICES, RANDOM_MOVE_PROBABILITY } from "./game.constants";
import { applyMove, createEmptyBoard, getAvailableMoves, getWinner, isValidMove } from "./game.rules";
import type { Board, RandomFn } from "./game.types";

function boardFrom(layout: string): Board {
    return layout.split("").map((char) => (char === "." ? null : char)) as Board;
}

const always = (value: number): RandomFn => () => value;

/** Deterministic pseudo-random generator (LCG) so the property test is reproducible. */
function seededRandom(seed: number): RandomFn {
    let state = seed;
    return () => {
        state = (state * 1664525 + 1013904223) % 2 ** 32;
        return state / 2 ** 32;
    };
}

describe("findWinningMove", () => {
    it("finds the cell that completes a line", () => {
        expect(findWinningMove(boardFrom("OO.XX...."), "O")).toBe(2);
        expect(findWinningMove(boardFrom("OO.XX...."), "X")).toBe(5);
    });

    it("returns null when there is no immediate win", () => {
        expect(findWinningMove(boardFrom("X...O...."), "X")).toBeNull();
    });
});

describe("chooseComputerMove", () => {
    it("takes a winning move when one exists", () => {
        expect(chooseComputerMove(boardFrom("OO.XX...."), always(0.99))).toBe(2);
    });

    it("prefers winning over blocking", () => {
        expect(chooseComputerMove(boardFrom("OO.XX...."), always(0))).toBe(2);
    });

    it("blocks the player's winning move when the block roll succeeds", () => {
        const roll = BLOCK_PROBABILITY - 0.01;
        expect(chooseComputerMove(boardFrom("XX..O...."), always(roll))).toBe(2);
    });

    it("sometimes misses the block, which keeps it beatable", () => {
        const move = chooseComputerMove(boardFrom("XX..O...."), always(0.99));
        expect(move).not.toBe(2);
        expect(isValidMove(boardFrom("XX..O...."), move)).toBe(true);
    });

    it("takes the center when it is free", () => {
        expect(chooseComputerMove(boardFrom("X........"), always(0.5))).toBe(4);
    });

    it("takes a corner when the center is taken", () => {
        const move = chooseComputerMove(boardFrom("....X...."), always(0.5));
        expect(CORNER_INDICES).toContain(move);
    });

    it("occasionally plays a random free cell instead of the strategic move", () => {
        const roll = RANDOM_MOVE_PROBABILITY - 0.01;
        const move = chooseComputerMove(boardFrom("X........"), always(roll));
        expect(move).not.toBe(4);
        expect(isValidMove(boardFrom("X........"), move)).toBe(true);
    });

    it("throws on a full board", () => {
        expect(() => chooseComputerMove(boardFrom("XOXXOOOXX"))).toThrow();
    });

    it("always returns a legal move", () => {
        const random = seededRandom(42);

        for (let game = 0; game < 300; game++) {
            let board = createEmptyBoard();
            let turn: "X" | "O" = "X";

            while (getWinner(board) === null && getAvailableMoves(board).length > 0) {
                if (turn === "O") {
                    const move = chooseComputerMove(board, random);
                    expect(isValidMove(board, move)).toBe(true);
                    board = applyMove(board, move, "O");
                } else {
                    const moves = getAvailableMoves(board);
                    board = applyMove(board, moves[Math.floor(random() * moves.length)]!, "X");
                }
                turn = turn === "X" ? "O" : "X";
            }
        }
    });

    it("is not unbeatable: the opposite-corner fork wins even when it always blocks", () => {
        const random = always(0.5); // always blocks, never plays a random move
        let board = createEmptyBoard();

        const playerMoves = [0, 8, 2, 5];
        for (const playerMove of playerMoves) {
            board = applyMove(board, playerMove, "X");
            if (getWinner(board) !== null) break;
            board = applyMove(board, chooseComputerMove(board, random), "O");
        }

        expect(getWinner(board)).toBe("X");
    });
});
