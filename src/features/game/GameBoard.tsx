import type { Board } from "../../game/game.types";
import GameCell from "./GameCell";
import WinningLine from "./WinningLine";
import "../../components/ui/board.css";

interface GameBoardProps {
    board: Board;
    disabled: boolean;
    winningCells: number[];
    onCellClick: (index: number) => void;
}

export default function GameBoard({ board, disabled, winningCells, onCellClick }: GameBoardProps) {
    return (
        <div className="board game-board" role="group" aria-label="לוח המשחק">
            {board.map((value, index) => (
                <GameCell
                    key={index}
                    index={index}
                    value={value}
                    disabled={disabled}
                    isWinning={winningCells.includes(index)}
                    onClick={onCellClick}
                />
            ))}
            <WinningLine cells={winningCells} />
        </div>
    );
}
