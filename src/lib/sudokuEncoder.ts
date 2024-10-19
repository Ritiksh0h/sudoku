import { Board, Difficulty, SudokuData } from "./sudoku";

const difficultyMap: Record<Difficulty, string> = {
  easy: "E",
  medium: "M",
  hard: "H",
  expert: "X",
};

const reverseDifficultyMap: Record<string, Difficulty> = {
  E: "easy",
  M: "medium",
  H: "hard",
  X: "expert",
};

function stringToGrid(str: string): Board {
  return Array.from({ length: 9 }, (_, i) =>
    str
      .slice(i * 9, (i + 1) * 9)
      .split("")
      .map(Number)
  );
}

// function gridToString(grid: Board): string {
//   return grid.flat().join("");
// }

function compressSudokuString(str: string): string {
  return str.replace(/-/g, "0");
}

// function decompressSudokuString(str: string): string {
//   return str.replace(/0/g, "-");
// }

function validatePuzzleAndSolution(puzzle: Board, solution: Board): boolean {
  for (let i = 0; i < 9; i++) {
    for (let j = 0; j < 9; j++) {
      if (puzzle[i][j] !== 0 && puzzle[i][j] !== solution[i][j]) {
        return false;
      }
    }
  }
  return true;
}

export function sudokuToCompactString(data: SudokuData): string {
  const compressedPuzzle = compressSudokuString(data.puzzle);
  const compressedSolution = compressSudokuString(data.solution);
  const difficultyCode = difficultyMap[data.difficulty];

  const combinedString = `${compressedPuzzle}|${compressedSolution}|${difficultyCode}`;
  return Buffer.from(combinedString).toString("base64");
}

export function compactStringToSudoku(encodedString: string): {
  puzzle: Board;
  solution: Board;
  difficulty: Difficulty;
} {
  try {
    const decodedString = Buffer.from(encodedString, "base64").toString(
      "utf-8"
    );
    const [compressedPuzzle, compressedSolution, difficultyCode] =
      decodedString.split("|");

    const puzzle = stringToGrid(compressSudokuString(compressedPuzzle));
    const solution = stringToGrid(compressedSolution);

    if (!validatePuzzleAndSolution(puzzle, solution)) {
      throw new Error("Invalid Sudoku: Puzzle and solution are incompatible");
    }

    return {
      puzzle,
      solution,
      difficulty: reverseDifficultyMap[difficultyCode] as Difficulty,
    };
  } catch (error) {
    console.error("Error decoding Sudoku:", error);
    throw new Error("Invalid Sudoku code");
  }
}
