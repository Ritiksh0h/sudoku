import React from "react";

type Board = number[][];
type Cell = { row: number; col: number } | null;

interface GameBoardProps {
  board: Board;
  initialBoard: Board;
  selectedCell: Cell;
  isRunning: boolean;
  gameStatus: "playing" | "won" | "lost";
  settings: {
    highlightSameRowColumnBox: boolean;
    highlightSameNumber: boolean;
    highlightConflictingNumbers: boolean;
  };
  onCellClick: (rowIndex: number, colIndex: number) => void;
}

export function GameBoard({
  board,
  initialBoard,
  selectedCell,
  isRunning,
  gameStatus,
  settings,
  onCellClick,
}: GameBoardProps) {
  const getCellBorderClass = (rowIndex: number, colIndex: number): string => {
    let borderClass = "border border-black/50 ";
    if (rowIndex % 3 === 0) borderClass += "border-t-2 border-t-black ";
    if (colIndex % 3 === 0) borderClass += "border-l-2 border-l-black ";
    if (rowIndex === 8) borderClass += "border-b-2 border-b-black ";
    if (colIndex === 8) borderClass += "border-r-2 border-r-black ";
    return borderClass;
  };

  const getCellErrorClass = (rowIndex: number, colIndex: number): string => {
    if (
      settings.highlightConflictingNumbers &&
      board[rowIndex][colIndex] !== 0 &&
      board[rowIndex][colIndex] !== initialBoard[rowIndex][colIndex]
    ) {
      // Check if the number conflicts with any other number in the same row, column, or box
      const num = board[rowIndex][colIndex];
      for (let i = 0; i < 9; i++) {
        if (i !== colIndex && board[rowIndex][i] === num) return "bg-red-200 ";
        if (i !== rowIndex && board[i][colIndex] === num) return "bg-red-200 ";
      }
      const boxRowStart = rowIndex - (rowIndex % 3);
      const boxColStart = colIndex - (colIndex % 3);
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if (
            boxRowStart + i !== rowIndex &&
            boxColStart + j !== colIndex &&
            board[boxRowStart + i][boxColStart + j] === num
          )
            return "bg-red-200 ";
        }
      }
    }
    return "";
  };

  const getCellHighlightClass = (
    rowIndex: number,
    colIndex: number
  ): string => {
    if (!settings.highlightSameRowColumnBox && !settings.highlightSameNumber)
      return "";

    let highlightClass = "";
    if (selectedCell) {
      const sameRowCol =
        rowIndex === selectedCell.row || colIndex === selectedCell.col;
      const sameBox =
        Math.floor(rowIndex / 3) === Math.floor(selectedCell.row / 3) &&
        Math.floor(colIndex / 3) === Math.floor(selectedCell.col / 3);
      const sameNumber =
        board[rowIndex][colIndex] !== 0 &&
        board[rowIndex][colIndex] === board[selectedCell.row][selectedCell.col];

      if (settings.highlightSameRowColumnBox && (sameRowCol || sameBox)) {
        highlightClass += "bg-primary/20 ";
      }
      if (settings.highlightSameNumber && sameNumber) {
        highlightClass += "bg-blue-100 ";
      }
    }
    return highlightClass;
  };

  return (
    <div
      className={`grid grid-cols-9 bg-white ${
        !isRunning || gameStatus !== "playing" ? "opacity-50 text-white" : "text-black"
      }`}
    >
      {board.map((row, rowIndex) =>
        row.map((cell, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={`aspect-square flex items-center justify-center text-xl  font-semibold 
            ${getCellBorderClass(rowIndex, colIndex)}
            ${getCellHighlightClass(rowIndex, colIndex)}
            ${getCellErrorClass(rowIndex, colIndex)}
            ${
              selectedCell?.row === rowIndex && selectedCell?.col === colIndex
                ? "bg-primary/40"
                : ""
            }
            ${isRunning ? "cursor-pointer" : "cursor-not-allowed"}
          `}
            onClick={() => onCellClick(rowIndex, colIndex)}
          >
            {cell !== 0 && cell}
          </div>
        ))
      )}
    </div>
  );
}
