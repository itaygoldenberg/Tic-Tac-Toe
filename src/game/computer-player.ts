import {
    BLOCK_PROBABILITY,
    CENTER_INDEX,
    COMPUTER,
    CORNER_INDICES,
    PLAYER,
    RANDOM_MOVE_PROBABILITY,
    WINNING_LINES
} from "./game.constants";
import { getAvailableMoves } from "./game.rules";
import type { Board, Player, RandomFn } from "./game.types";

/** Finds a cell that completes a line for `player` on their next move, if any. */
export function findWinningMove(board: Board, player: Player): number | null {
    for (const line of WINNING_LINES) {
        const values = line.map((index) => board[index]);
        const ownCount = values.filter((value) => value === player).length;
        const emptyIndex = line.find((index) => board[index] === null);

        if (ownCount === 2 && emptyIndex !== undefined) return emptyIndex;
    }
    return null;
}

function pickRandom<T>(items: readonly T[], random: RandomFn): T {
    const index = Math.min(Math.floor(random() * items.length), items.length - 1);
    return items[index]!;
}

/**
 * Heuristic opponent: win → block (usually) → occasional random move → center → corner → any.
 * Deliberately not minimax, so the player can beat it.
 */
export function chooseComputerMove(board: Board, random: RandomFn = Math.random): number {
    const available = getAvailableMoves(board);
    if (available.length === 0) {
        throw new Error("chooseComputerMove called on a full board");
    }

    const winningMove = findWinningMove(board, COMPUTER);
    if (winningMove !== null) return winningMove;

    const blockingMove = findWinningMove(board, PLAYER);
    if (blockingMove !== null && random() < BLOCK_PROBABILITY) return blockingMove;

    if (random() < RANDOM_MOVE_PROBABILITY) return pickRandom(available, random);

    if (board[CENTER_INDEX] === null) return CENTER_INDEX;

    const freeCorners = CORNER_INDICES.filter((index) => board[index] === null);
    if (freeCorners.length > 0) return pickRandom(freeCorners, random);

    return pickRandom(available, random);
}
