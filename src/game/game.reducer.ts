import { COMPUTER, PLAYER } from "./game.constants";
import { createInitialGameState } from "./game.initial-state";
import { applyMove, getGameOutcome, isValidMove } from "./game.rules";
import type { GameState } from "./game.types";

// The computer's move is chosen outside the reducer (it is random), keeping the reducer pure.
export type GameAction =
    | { type: "PLAYER_MOVE"; index: number }
    | { type: "COMPUTER_MOVE"; index: number }
    | { type: "NEW_GAME" };

export function gameReducer(state: GameState, action: GameAction): GameState {
    switch (action.type) {
        case "PLAYER_MOVE": {
            if (state.status !== "playing" || state.isComputerTurn) return state;
            if (!isValidMove(state.board, action.index)) return state;

            const board = applyMove(state.board, action.index, PLAYER);
            const outcome = getGameOutcome(board);

            return {
                board,
                status: outcome.status,
                winningCells: outcome.winningCells,
                isComputerTurn: outcome.status === "playing"
            };
        }

        case "COMPUTER_MOVE": {
            if (state.status !== "playing" || !state.isComputerTurn) return state;
            if (!isValidMove(state.board, action.index)) return state;

            const board = applyMove(state.board, action.index, COMPUTER);
            const outcome = getGameOutcome(board);

            return {
                board,
                status: outcome.status,
                winningCells: outcome.winningCells,
                isComputerTurn: false
            };
        }

        case "NEW_GAME":
            return createInitialGameState();
    }
}
