import NeonTitle from "../../components/ui/NeonTitle";
import GameBoard from "./GameBoard";
import GameResult from "./GameResult";
import MuteButton from "./MuteButton";
import NewGameButton from "./NewGameButton";
import { useGame } from "./useGame";
import { useGameSounds } from "./useGameSounds";
import "./game.css";

export default function GamePage() {
    const { state, playCell, newGame } = useGame();
    const { isMuted, toggleMute } = useGameSounds(state);
    const isBoardLocked = state.isComputerTurn || state.status !== "playing";

    return (
        <section className="page game-page">
            <header className="page__header game-page__header">
                <NeonTitle />
                <MuteButton isMuted={isMuted} onToggle={toggleMute} />
                <GameResult status={state.status} />
            </header>

            <GameBoard
                board={state.board}
                disabled={isBoardLocked}
                winningCells={state.winningCells}
                onCellClick={playCell}
            />

            <NewGameButton onClick={newGame} />
        </section>
    );
}
