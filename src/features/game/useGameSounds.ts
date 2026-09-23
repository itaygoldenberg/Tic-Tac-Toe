import { useCallback, useEffect, useRef, useState } from "react";
import type { GameState } from "../../game/game.types";
import { audioService, type AudioService } from "../../services/audio.service";

/**
 * Plays sound effects for game-state transitions (new X, new O, game over)
 * and exposes the mute toggle. Mute lives in the audio service, so it survives
 * leaving the game screen but not a reload.
 */
export function useGameSounds(state: GameState, audio: AudioService = audioService) {
    const [isMuted, setIsMuted] = useState(() => audio.isMuted);
    const previousState = useRef(state);

    useEffect(() => {
        const previous = previousState.current;
        previousState.current = state;
        if (previous === state) return;

        const placedIndex = state.board.findIndex((cell, index) => cell !== null && previous.board[index] === null);
        const placed = placedIndex === -1 ? null : state.board[placedIndex];
        if (placed === "X") audio.playX();
        if (placed === "O") audio.playO();

        if (previous.status === "playing") {
            if (state.status === "playerWon") audio.playWin();
            if (state.status === "computerWon") audio.playLose();
            if (state.status === "draw") audio.playDraw();
        }
    }, [state, audio]);

    const toggleMute = useCallback(() => {
        const next = !audio.isMuted;
        audio.setMuted(next);
        setIsMuted(next);
    }, [audio]);

    return { isMuted, toggleMute };
}
