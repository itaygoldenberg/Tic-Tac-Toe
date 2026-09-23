import type { Player } from "./game.types";

export const PLAYER: Player = "X";
export const COMPUTER: Player = "O";

export const BOARD_SIZE = 9;
export const CENTER_INDEX = 4;
export const CORNER_INDICES = [0, 2, 6, 8] as const;

export const WINNING_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
] as const;

export const COMPUTER_MOVE_DELAY_MS = 500;

// Computer player tuning — keeps the opponent smart but beatable. Not exposed as a difficulty setting.
/** Chance the computer blocks an immediate winning threat of the player. */
export const BLOCK_PROBABILITY = 0.85;
/** Chance the computer plays a random free cell instead of its strategic choice. */
export const RANDOM_MOVE_PROBABILITY = 0.15;
