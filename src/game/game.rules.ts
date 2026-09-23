import { BOARD_SIZE, COMPUTER, PLAYER, WINNING_LINES } from "./game.constants";
import type { Board, GameStatus, Player } from "./game.types";

export interface GameOutcome {
    status: GameStatus;
    winningCells: number[];
}

export function createEmptyBoard(): Board {
    return [null, null, null, null, null, null, null, null, null];
}

export function isValidMove(board: Board, index: number): boolean {
    return Number.isInteger(index) && index >= 0 && index < BOARD_SIZE && board[index] === null;
}

export function getAvailableMoves(board: Board): number[] {
    const moves: number[] = [];
    board.forEach((cell, index) => {
        if (cell === null) moves.push(index);
    });
    return moves;
}

/** Returns a new board with the move applied; the input board is never mutated. */
export function applyMove(board: Board, index: number, player: Player): Board {
    const next: Board = [...board];
    next[index] = player;
    return next;
}

export function getWinningLine(board: Board): number[] | null {
    for (const line of WINNING_LINES) {
        const [a, b, c] = line;
        const value = board[a];
        if (value !== null && value === board[b] && value === board[c]) {
            return [...line];
        }
    }
    return null;
}

export function getWinner(board: Board): Player | null {
    const line = getWinningLine(board);
    return line ? (board[line[0]!] ?? null) : null;
}

export function isBoardFull(board: Board): boolean {
    return board.every((cell) => cell !== null);
}

export function isDraw(board: Board): boolean {
    return isBoardFull(board) && getWinner(board) === null;
}

export function getGameOutcome(board: Board): GameOutcome {
    const winningLine = getWinningLine(board);

    if (winningLine) {
        const winner = board[winningLine[0]!];
        if (winner === PLAYER) return { status: "playerWon", winningCells: winningLine };
        if (winner === COMPUTER) return { status: "computerWon", winningCells: winningLine };
    }

    if (isBoardFull(board)) return { status: "draw", winningCells: [] };

    return { status: "playing", winningCells: [] };
}
