import { createEmptyBoard } from "./game.rules";
import type { GameState } from "./game.types";

export function createInitialGameState(): GameState {
    return {
        board: createEmptyBoard(),
        status: "playing",
        isComputerTurn: false,
        winningCells: []
    };
}
