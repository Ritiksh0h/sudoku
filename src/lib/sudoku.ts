import { getSudoku } from "sudoku-gen";

export type Difficulty = "easy" | "medium" | "hard" | "expert";
export type Board = number[][];
export type Cell = { row: number; col: number } | null;
export type SudokuMetrics = {
  logicDecisions: number;
  possibilitiesCount: number;
  totalBacktracks: number;
  nakedSinglesUsed: number;
  hiddenSinglesUsed: number;
  highlyConstrainedCells: number;
  initialClues: number;
  ertScale: number;
};
export type SudokuData = {
  puzzle: string;
  solution: string;
  difficulty: Difficulty;
};

// Check if placing `num` at `board[row][col]` is safe (row, col, and box check)
export const isSafe = (
  board: Board,
  row: number,
  col: number,
  num: number
): boolean => {
  for (let i = 0; i < 9; i++) {
    if (board[row][i] === num || board[i][col] === num) return false;
  }
  const boxRowStart = row - (row % 3);
  const boxColStart = col - (col % 3);
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[boxRowStart + i][boxColStart + j] === num) return false;
    }
  }
  return true;
};

export function stringTo9x9Array(numberString: string): number[][] {
  if (numberString.length !== 81) {
    throw new Error("Input string must be exactly 81 characters long.");
  }

  // Convert the string into an array of numbers
  const numberList: number[] = numberString.split("").map(Number);

  // Create the 9x9 array (array of arrays)
  const array9x9: number[][] = [];
  for (let i = 0; i < 81; i += 9) {
    array9x9.push(numberList.slice(i, i + 9));
  }

  return array9x9;
}

// Function to generate Sudoku board with given difficulty
export const generateSudokuWithMetrics = (
  difficulty: Difficulty = "easy"
): {
  board: Board;
  solution: Board;
  difficulty: Difficulty;
  sudoku: SudokuData;
} => {
  const sudoku = getSudoku(difficulty);
  const board = stringTo9x9Array(sudoku.puzzle.replace(/-/g, "0"));
  const solution = stringTo9x9Array(sudoku.solution);

  return { board, solution, difficulty, sudoku };
};

export const isBoardComplete = (board: Board): boolean => {
  // Helper to check if an array contains unique values from 1 to 9
  const containsAllDigits = (arr: number[]): boolean => {
    const sorted = arr.slice().sort(); // Create a sorted copy of the array
    return (
      JSON.stringify(sorted) === JSON.stringify([1, 2, 3, 4, 5, 6, 7, 8, 9])
    );
  };

  // Check all rows
  for (let row = 0; row < 9; row++) {
    if (!containsAllDigits(board[row])) return false;
  }

  // Check all columns
  for (let col = 0; col < 9; col++) {
    const column = board.map((row) => row[col]); // Extract column as an array
    if (!containsAllDigits(column)) return false;
  }

  // Check all 3x3 boxes
  for (let boxRow = 0; boxRow < 3; boxRow++) {
    for (let boxCol = 0; boxCol < 3; boxCol++) {
      const box = [];
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          box.push(board[boxRow * 3 + i][boxCol * 3 + j]);
        }
      }
      if (!containsAllDigits(box)) return false;
    }
  }

  // If all checks pass, the board is complete and correct
  return true;
};
