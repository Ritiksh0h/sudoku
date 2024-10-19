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

// Create a character set for the encoding
const chars =
  "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_";

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

function stringTo9x9Array(numberString: string): number[][] {
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

function stringTo9x9ArrayWithZero(numberString: string): number[][] {
  if (numberString.length !== 81) {
    throw new Error("Input string must be exactly 81 characters long.");
  }

  // Convert the string into an array of numbers, replacing '-' with 0
  const numberList: number[] = numberString
    .split("")
    .map((char) => (char === "-" ? 0 : Number(char)));

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
): { board: Board; solution: Board; difficulty: Difficulty } => {
  const sudoku = getSudoku(difficulty);
  const board = stringTo9x9ArrayWithZero(sudoku.puzzle);
  const solution = stringTo9x9Array(sudoku.solution);
  return { board, solution, difficulty };
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

// export const isSafe = (
//   board: Board,
//   row: number,
//   col: number,
//   num: number
// ): boolean => {
//   for (let i = 0; i < 9; i++) {
//     if (board[row][i] === num || board[i][col] === num) return false;
//   }
//   const boxRowStart = row - (row % 3);
//   const boxColStart = col - (col % 3);
//   for (let i = 0; i < 3; i++) {
//     for (let j = 0; j < 3; j++) {
//       if (board[boxRowStart + i][boxColStart + j] === num) return false;
//     }
//   }
//   return true;
// };

// const removeNumbers = (board: Board, difficulty: Difficulty): void => {
//   const clues =
//     difficulty === "easy"
//       ? 45
//       : difficulty === "medium"
//       ? 35
//       : difficulty === "hard"
//       ? 25
//       : 20; // Expert difficulty
//   const cellsToRemove = 81 - clues;
//   for (let i = 0; i < cellsToRemove; i++) {
//     let row: number, col: number;
//     do {
//       row = Math.floor(Math.random() * 9);
//       col = Math.floor(Math.random() * 9);
//     } while (board[row][col] === 0);
//     board[row][col] = 0;
//   }
// };

// Get all possible numbers for a cell
// const getPossibleNumbers = (
//   board: Board,
//   row: number,
//   col: number
// ): number[] => {
//   const possibilities: number[] = [];
//   for (let num = 1; num <= 9; num++) {
//     if (isSafe(board, row, col, num)) possibilities.push(num);
//   }
//   return possibilities;
// };

// Naked Single Strategy: If a cell has only 1 possible number, place it
// const applyNakedSingles = (board: Board, metrics: SudokuMetrics): boolean => {
//   let found = false;
//   for (let row = 0; row < 9; row++) {
//     for (let col = 0; col < 9; col++) {
//       if (board[row][col] === 0) {
//         const possibilities = getPossibleNumbers(board, row, col);
//         if (possibilities.length === 1) {
//           board[row][col] = possibilities[0];
//           metrics.nakedSinglesUsed++;
//           found = true;
//         }
//       }
//     }
//   }
//   return found;
// };

// Hidden Single Strategy: Check if a number can only go in one place within a row, column, or box
// const applyHiddenSingles = (board: Board, metrics: SudokuMetrics): boolean => {
//   let found = false;

//   // Check row, column, and box for hidden singles
//   const checkHiddenSingle = (indices: number[][]): boolean => {
//     for (let num = 1; num <= 9; num++) {
//       const possibleCells: number[] = [];
//       for (const [row, col] of indices) {
//         if (board[row][col] === 0 && isSafe(board, row, col, num)) {
//           possibleCells.push(row * 9 + col);
//         }
//       }
//       if (possibleCells.length === 1) {
//         const row = Math.floor(possibleCells[0] / 9);
//         const col = possibleCells[0] % 9;
//         board[row][col] = num;
//         metrics.hiddenSinglesUsed++;
//         found = true;
//       }
//     }
//     return found;
//   };

//   // Row check
//   for (let row = 0; row < 9; row++) {
//     const rowIndices = Array(9)
//       .fill(0)
//       .map((_, col) => [row, col]);
//     found = checkHiddenSingle(rowIndices) || found;
//   }

//   // Column check
//   for (let col = 0; col < 9; col++) {
//     const colIndices = Array(9)
//       .fill(0)
//       .map((_, row) => [row, col]);
//     found = checkHiddenSingle(colIndices) || found;
//   }

//   // Box check
//   for (let boxRow = 0; boxRow < 3; boxRow++) {
//     for (let boxCol = 0; boxCol < 3; boxCol++) {
//       const boxIndices = [];
//       for (let i = 0; i < 3; i++) {
//         for (let j = 0; j < 3; j++) {
//           boxIndices.push([boxRow * 3 + i, boxCol * 3 + j]);
//         }
//       }
//       found = checkHiddenSingle(boxIndices) || found;
//     }
//   }

//   return found;
// };

// Extended solver with advanced techniques
// const fillSudokuWithMetrics = (
//   board: Board,
//   metrics: SudokuMetrics
// ): boolean => {
//   let modified = true;
//   while (modified) {
//     modified =
//       applyNakedSingles(board, metrics) || applyHiddenSingles(board, metrics);
//   }

//   for (let row = 0; row < 9; row++) {
//     for (let col = 0; col < 9; col++) {
//       if (board[row][col] === 0) {
//         let possibilities = 0;
//         for (let num = 1; num <= 9; num++) {
//           if (isSafe(board, row, col, num)) {
//             possibilities++;
//             board[row][col] = num;
//             metrics.logicDecisions++;
//             if (possibilities <= 2) metrics.highlyConstrainedCells++;
//             if (fillSudokuWithMetrics(board, metrics)) return true;
//             metrics.totalBacktracks++; // Track backtracking events
//             board[row][col] = 0;
//           }
//         }
//         metrics.possibilitiesCount += possibilities; // Track the number of possibilities
//         return false;
//       }
//     }
//   }
//   return true;
// };

// Calculate the ERT scale based on new metrics
// const calculateERT = (metrics: SudokuMetrics): number => {
//   const { totalBacktracks, highlyConstrainedCells } = metrics;
//   const constraintFactor = highlyConstrainedCells / 81;

//   if (totalBacktracks < 50 && constraintFactor < 0.1) return 1; // Easy
//   if (totalBacktracks < 200 && constraintFactor < 0.3) return 2; // Medium
//   if (totalBacktracks < 500 && constraintFactor < 0.6) return 3; // Hard
//   return 4; // Ultrahard
// };

// Generate Sudoku with advanced metrics
// export const generateSudokuWithMetrics = (
//   difficulty: Difficulty = "easy"
// ): Board => {
//   const board: Board = Array(9)
//     .fill(null)
//     .map(() => Array(9).fill(0));
//   const metrics: SudokuMetrics = {
//     logicDecisions: 0,
//     possibilitiesCount: 0,
//     totalBacktracks: 0,
//     nakedSinglesUsed: 0,
//     hiddenSinglesUsed: 0,
//     nakedPairsUsed: 0, // Future feature
//     highlyConstrainedCells: 0,
//     initialClues: 0,
//     ertScale: 0,
//   };
//   fillSudokuWithMetrics(board, metrics);

//   // Remove numbers according to difficulty and track clues
//   removeNumbers(board, difficulty);
//   metrics.initialClues = board.flat().filter((n) => n !== 0).length;

//   // Calculate enhanced ERT scale
//   metrics.ertScale = calculateERT(metrics);

//   return board;
//   // return { board, metrics };
// };

// Convert the board to a compact string representation
export const boardToString = (board: Board): string => {
  let result = "";
  let current = 0;
  let count = 0;

  for (let row = 0; row < 9; row++) {
    for (let col = 0; col < 9; col++) {
      current = (current << 4) | board[row][col];
      count += 4;
      while (count >= 6) {
        count -= 6;
        result += chars[current >> count];
        current &= (1 << count) - 1;
      }
    }
  }

  // Handle remaining bits
  if (count > 0) {
    result += chars[current << (6 - count)];
  }

  return result;
};

// Convert a compact string back to a Sudoku board
export const stringToBoard = (str: string): Board => {
  const board: Board = Array(9)
    .fill(null)
    .map(() => Array(9).fill(0));
  let current = 0;
  let count = 0;
  let index = 0;

  for (let i = 0; i < str.length; i++) {
    current = (current << 6) | chars.indexOf(str[i]);
    count += 6;
    while (count >= 4 && index < 81) {
      count -= 4;
      const row = Math.floor(index / 9);
      const col = index % 9;
      board[row][col] = (current >> count) & 15;
      index++;
    }
  }

  return board;
};
