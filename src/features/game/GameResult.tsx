import type { GameStatus } from "../../game/game.types";

const RESULT_MESSAGES: Record<GameStatus, string> = {
    playing: "",
    playerWon: "ניצחת!",
    computerWon: "הפסדת!",
    draw: "תיקו!"
};

export default function GameResult({ status }: { status: GameStatus }) {
    return (
        <p className="game-result" data-status={status} role="status">
            {RESULT_MESSAGES[status]}
        </p>
    );
}
