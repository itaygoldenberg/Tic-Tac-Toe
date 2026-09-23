import NeonTitle from "../../components/ui/NeonTitle";
import type { Board } from "../../game/game.types";
import GameBoard from "./GameBoard";
import "./game.css";

// Game state and interaction arrive in Milestone 2; for now the board is a static, locked grid.
const EMPTY_BOARD: Board = [null, null, null, null, null, null, null, null, null];

export default function GamePage() {
    return (
        <section className="page game-page">
            <header className="page__header">
                <NeonTitle />
            </header>

            <GameBoard board={EMPTY_BOARD} disabled winningCells={[]} onCellClick={() => {}} />
        </section>
    );
}
