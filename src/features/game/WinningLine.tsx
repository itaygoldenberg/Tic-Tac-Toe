const OVERSHOOT = 0.12;

/** Center of a cell in a 0–100 left-to-right coordinate space (mirrored for RTL in CSS). */
function cellCenter(index: number) {
    const column = index % 3;
    const row = Math.floor(index / 3);
    return { x: ((column * 2 + 1) / 6) * 100, y: ((row * 2 + 1) / 6) * 100 };
}

export default function WinningLine({ cells }: { cells: number[] }) {
    const first = cells[0];
    const last = cells[cells.length - 1];
    if (cells.length !== 3 || first === undefined || last === undefined) return null;

    const start = cellCenter(first);
    const end = cellCenter(last);
    const dx = (end.x - start.x) * OVERSHOOT;
    const dy = (end.y - start.y) * OVERSHOOT;

    return (
        <svg
            className="winning-line"
            data-cells={cells.join(",")}
            viewBox="0 0 100 100"
            aria-hidden="true"
        >
            <line x1={start.x - dx} y1={start.y - dy} x2={end.x + dx} y2={end.y + dy} pathLength={1} />
        </svg>
    );
}
