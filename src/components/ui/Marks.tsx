import type { Player } from "../../game/game.types";

interface MarkProps {
    /** Draw-in animation when the mark appears (game board only). */
    animated?: boolean;
}

function markClass(player: "x" | "o", animated: boolean) {
    return `mark mark--${player}${animated ? " mark--animated" : ""}`;
}

// pathLength={1} lets the CSS draw animation work in normalized dash units.
export function XMark({ animated = false }: MarkProps) {
    return (
        <svg className={markClass("x", animated)} viewBox="0 0 100 100" aria-hidden="true">
            <path d="M24 24 L76 76" pathLength={1} />
            <path d="M76 24 L24 76" pathLength={1} />
        </svg>
    );
}

export function OMark({ animated = false }: MarkProps) {
    return (
        <svg className={markClass("o", animated)} viewBox="0 0 100 100" aria-hidden="true">
            <circle cx="50" cy="50" r="28" pathLength={1} />
        </svg>
    );
}

export function Mark({ player, animated = false }: MarkProps & { player: Player }) {
    return player === "X" ? <XMark animated={animated} /> : <OMark animated={animated} />;
}
