import { useCallback, useEffect, useReducer } from "react";
import { chooseComputerMove } from "../../game/computer-player";
import { COMPUTER_MOVE_DELAY_MS } from "../../game/game.constants";
import { createInitialGameState } from "../../game/game.initial-state";
import { gameReducer } from "../../game/game.reducer";

/**
 * Game state lives only as long as the component using this hook,
 * so leaving the game screen resets the game.
 */
export function useGame() {
    const [state, dispatch] = useReducer(gameReducer, undefined, createInitialGameState);

    useEffect(() => {
        if (!state.isComputerTurn || state.status !== "playing") return;

        const timerId = window.setTimeout(() => {
            dispatch({ type: "COMPUTER_MOVE", index: chooseComputerMove(state.board) });
        }, COMPUTER_MOVE_DELAY_MS);

        return () => window.clearTimeout(timerId);
    }, [state.isComputerTurn, state.status, state.board]);

    const playCell = useCallback((index: number) => dispatch({ type: "PLAYER_MOVE", index }), []);
    const newGame = useCallback(() => dispatch({ type: "NEW_GAME" }), []);

    return { state, playCell, newGame };
}
