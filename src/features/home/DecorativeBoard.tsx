import type { Board } from "../../game/game.types";
import { Mark } from "../../components/ui/Marks";
import "../../components/ui/board.css";

// Static illustration from the mockup, listed in visual (left-to-right) order.
const ILLUSTRATION: Board = ["O", "X", "O", "X", "O", null, "O", "X", "X"];

export default function DecorativeBoard() {
    return (
        <div className="board decorative-board" dir="ltr" aria-hidden="true">
            {ILLUSTRATION.map((value, index) => (
                <div key={index} className="board__cell">
                    {value && <Mark player={value} />}
                </div>
            ))}
            <svg className="decorative-board__line" viewBox="0 0 100 100" preserveAspectRatio="none">
                <line x1="5" y1="95" x2="95" y2="5" />
            </svg>
        </div>
    );
}
