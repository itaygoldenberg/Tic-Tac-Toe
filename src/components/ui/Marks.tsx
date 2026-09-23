import type { Player } from "../../game/game.types";

export function XMark() {
    return (
        <svg className="mark mark--x" viewBox="0 0 100 100" aria-hidden="true">
            <path d="M24 24 L76 76 M76 24 L24 76" />
        </svg>
    );
}

export function OMark() {
    return (
        <svg className="mark mark--o" viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="28" />
        </svg>
    );
}

export function Mark({ player }: { player: Player }) {
    return player === "X" ? <XMark /> : <OMark />;
}
