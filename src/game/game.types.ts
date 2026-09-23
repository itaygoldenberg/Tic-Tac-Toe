export type Player = "X" | "O";

export type CellValue = Player | null;

export type Board = [
    CellValue, CellValue, CellValue,
    CellValue, CellValue, CellValue,
    CellValue, CellValue, CellValue
];
