import NeonTitle from "../../components/ui/NeonTitle";
import GameBoard from "./GameBoard";
import GameResult from "./GameResult";
import NewGameButton from "./NewGameButton";
import { useGame } from "./useGame";
import "./game.css";

export default function GamePage() {
    const { state, playCell, newGame } = useGame();
    const isBoardLocked = state.isComputerTurn || state.status !== "playing";

    return (
        <section className="page game-page">
            <header className="page__header">
                <NeonTitle />
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
