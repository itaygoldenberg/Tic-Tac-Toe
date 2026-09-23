import type { CellValue } from "../../game/game.types";
import { Mark } from "../../components/ui/Marks";

interface GameCellProps {
    index: number;
    value: CellValue;
    disabled: boolean;
    isWinning: boolean;
    onClick: (index: number) => void;
}

export default function GameCell({ index, value, disabled, isWinning, onClick }: GameCellProps) {
    const label = `תא ${index + 1}, ${value ?? "ריק"}`;

    return (
        <button
            type="button"
            className="board__cell game-cell"
            data-winning={isWinning || undefined}
            disabled={disabled || value !== null}
            aria-label={label}
            onClick={() => onClick(index)}
        >
            {value && <Mark player={value} animated />}
        </button>
    );
}
