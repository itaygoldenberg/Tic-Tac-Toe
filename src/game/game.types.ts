export type Player = "X" | "O";

export type CellValue = Player | null;

export type Board = [
    CellValue, CellValue, CellValue,
    CellValue, CellValue, CellValue,
    CellValue, CellValue, CellValue
];

export type GameStatus =
    | "playing"
    | "playerWon"
    | "computerWon"
    | "draw";

export interface GameState {
    board: Board;
    status: GameStatus;
    isComputerTurn: boolean;
    winningCells: number[];
}

export type RandomFn = () => number;
