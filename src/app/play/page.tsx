"use client";
import React, { useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GameBoard } from "@/components/game-board";
import { GameControls } from "@/components/game-controls";
import { NumberPad } from "@/components/number-pad";
import {
  Board,
  Cell,
  Difficulty,
  generateSudokuWithMetrics,
  isBoardComplete,
} from "@/lib/sudoku";
import { Navbar } from "@/components/Navbar";
import { Settings } from "@/components/Settings";
import { Footer } from "@/components/Footer";
import GameEndDialog from "@/components/game-end";
import {
  compactStringToSudoku,
  sudokuToCompactString,
} from "@/lib/sudokuEncoder";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function SudokuGame() {
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [selectedCell, setSelectedCell] = useState<Cell>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("easy");
  const [history, setHistory] = useState<Board[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);
  const [isClient, setIsClient] = useState<boolean>(false);
  const [mistakes, setMistakes] = useState<number>(0);
  const [gameStatus, setGameStatus] = useState<"playing" | "won" | "lost">(
    "playing"
  );
  const [settings, setSettings] = useState<Settings>({
    displayTimer: true,
    limitHints: true,
    numberOfHints: 5,
    highlightSameRowColumnBox: true,
    highlightSameNumber: true,
    highlightConflictingNumbers: true,
    maxMistakes: 3,
  });
  const {
    board: initialBoard,
    solution: initialSolution,
    sudoku,
  } = useMemo(() => {
    const { board, solution, sudoku } = generateSudokuWithMetrics("easy");
    return { board, solution, sudoku };
  }, []);

  const [board, setBoard] = useState<Board>(() =>
    initialBoard.map((row) => [...row])
  );
  const [solution, setSolution] = useState<Board>(() =>
    initialSolution.map((row) => [...row])
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const generateGameUrl = (code: string) => {
    const baseUrl = window.location.origin;
    console.log(`${baseUrl}${pathname}?code=${encodeURIComponent(code)}`);
    return `${baseUrl}${pathname}?code=${encodeURIComponent(code)}`;
  };

  // const handleCodeEntered = (code: string) => {
  //   try {
  //     const decodedSudoku = compactStringToSudoku(code);
  //     setBoard(decodedSudoku.puzzle);
  //     setSolution(decodedSudoku.solution);
  //     setHistory([decodedSudoku.puzzle]);
  //     setHistoryIndex(0);
  //     setDifficulty(decodedSudoku.difficulty);
  //     setTime(0);
  //     setIsRunning(true);
  //     setMistakes(0);
  //     setGameStatus("playing");
  //     toast({
  //       title: "Puzzle Loaded",
  //       description: "The Sudoku puzzle has been successfully loaded.",
  //     });
  //   } catch (error) {
  //     console.error("Invalid Sudoku code:", error);
  //     toast({
  //       title: "Error",
  //       description: "Invalid Sudoku code. Please try again.",
  //       variant: "destructive",
  //     });
  //   }
  // };

  // Memoized handleNumberInput function

  const handleCodeEntered = useCallback(
    (code: string) => {
      try {
        const decodedSudoku = compactStringToSudoku(code);
        setBoard(decodedSudoku.puzzle);
        setSolution(decodedSudoku.solution);
        setHistory([decodedSudoku.puzzle]);
        setHistoryIndex(0);
        setDifficulty(decodedSudoku.difficulty);
        setTime(0);
        setIsRunning(true);
        setMistakes(0);
        setGameStatus("playing");
        toast({
          title: "Puzzle Loaded",
          description: "The Sudoku puzzle has been successfully loaded.",
        });
      } catch (error) {
        console.error("Invalid Sudoku code:", error);
        toast({
          title: "Error",
          description: "Invalid Sudoku code. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  useEffect(() => {
    const code = searchParams.get("code");
    if (code) {
      handleCodeEntered(code);
    }
  }, [searchParams, handleCodeEntered]);

  const handleNumberInput = useCallback(
    (num: number): void => {
      if (selectedCell && isRunning && gameStatus === "playing") {
        const { row, col } = selectedCell;
        if (initialBoard[row][col] !== 0) return; // Don't allow changing initial numbers

        const newBoard = board.map((r) => [...r]);
        newBoard[row][col] = num;

        // Only count mistakes if the input is not 0 (deletion) and the number is wrong
        if (num !== 0 && num !== solution[row][col]) {
          setMistakes((prev) => {
            const newMistakes = prev + 1;
            if (newMistakes >= settings.maxMistakes) {
              setGameStatus("lost");
              setIsRunning(false);
            }
            return newMistakes;
          });
        }

        setBoard(newBoard);
        setHistory([...history.slice(0, historyIndex + 1), newBoard]);
        setHistoryIndex(historyIndex + 1);

        if (isBoardComplete(newBoard)) {
          setGameStatus("won");
          setIsRunning(false);
          toast({
            title: "Congratulations!",
            description: "You've completed the Sudoku puzzle!",
          });
        }
      }
    },
    [
      selectedCell,
      isRunning,
      gameStatus,
      board,
      initialBoard,
      solution,
      history,
      historyIndex,
      settings.maxMistakes,
      toast,
    ]
  );

  // Handle keyboard inputs
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isRunning || gameStatus !== "playing") return;

      const { key } = event;
      if (key >= "1" && key <= "9") {
        event.preventDefault(); // Prevent tab switching
        handleNumberInput(parseInt(key, 10));
      } else if (key === "Backspace" || key === "Delete") {
        event.preventDefault(); // Prevent default browser behavior
        handleNumberInput(0); // Delete action
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleNumberInput, isRunning, gameStatus]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && settings.displayTimer && gameStatus === "playing") {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, settings.displayTimer, gameStatus]);

  const handleCellClick = (rowIndex: number, colIndex: number): void => {
    if (isRunning && gameStatus === "playing") {
      setSelectedCell({ row: rowIndex, col: colIndex });
    }
  };

  const handleUndo = (): void => {
    if (historyIndex > 0 && isRunning && gameStatus === "playing") {
      setHistoryIndex(historyIndex - 1);
      setBoard(history[historyIndex - 1]);
    }
  };

  const handleRedo = (): void => {
    if (
      historyIndex < history.length - 1 &&
      isRunning &&
      gameStatus === "playing"
    ) {
      setHistoryIndex(historyIndex + 1);
      setBoard(history[historyIndex + 1]);
    }
  };

  const handleNewGame = (newDifficulty?: Difficulty): void => {
    const { board, solution } = generateSudokuWithMetrics(
      newDifficulty || difficulty
    );
    setBoard(board);
    setSolution(solution);
    setTime(0);
    setHistory([board]);
    setHistoryIndex(0);
    setIsRunning(true);
    setMistakes(0);
    setGameStatus("playing");
    if (newDifficulty) {
      setDifficulty(newDifficulty);
    }
    const newCode = sudokuToCompactString(sudoku);
    const newUrl = generateGameUrl(newCode);
    router.push(newUrl);
    toast({
      title: "New Game",
      description: "A new Sudoku puzzle has been generated.",
    });
  };

  const handleRestartGame = (): void => {
    setBoard(initialBoard.map((row) => [...row])); // Reset to initial board
    setSolution(solution.map((row) => [...row])); // Reset to initial solution
    setTime(0);
    setHistory([initialBoard.map((row) => [...row])]);
    setHistoryIndex(0);
    setIsRunning(true);
    setMistakes(0);
    setGameStatus("playing");
  };

  const changeDifficulty = (newDifficulty: Difficulty): void => {
    handleNewGame(newDifficulty);
  };

  const togglePause = (): void => {
    if (gameStatus === "playing") {
      setIsRunning(!isRunning);
    }
  };

  if (!isClient) {
    return null; // or return a loading indicator
  }

  return (
    <Suspense>
      <div className="flex flex-col items-center min-h-screen p-4">
        <div className="w-full max-w-md">
          <Navbar
            difficulty={difficulty}
            onChangeDifficulty={changeDifficulty}
            onNewGame={handleNewGame}
            onRestartGame={handleRestartGame}
            settings={settings}
            onSettingsChange={setSettings}
            mistakes={mistakes}
            onCodeEntered={handleCodeEntered}
            shareCode={sudokuToCompactString(sudoku)}
          />

          <Card className="shadow-lg">
            <CardContent className="pt-6">
              <GameBoard
                board={board}
                initialBoard={initialBoard}
                selectedCell={selectedCell}
                isRunning={isRunning}
                gameStatus={gameStatus}
                settings={settings}
                onCellClick={handleCellClick}
              />
            </CardContent>
          </Card>
          {/* <div className="text-xs text-muted-foreground/40 py-2 text-center mx-auto">
            {extractBeforeUnderscore(sudokuCode)}
          </div> */}

          <GameControls
            isRunning={isRunning}
            gameStatus={gameStatus}
            settings={settings}
            time={time}
            mistakes={mistakes}
            maxMistakes={settings.maxMistakes}
            onTogglePause={togglePause}
            onUndo={handleUndo}
            onRedo={handleRedo}
            // onHint={handleHint}
          />

          <NumberPad
            isRunning={isRunning}
            gameStatus={gameStatus}
            onNumberInput={handleNumberInput}
            board={board}
          />
        </div>

        <GameEndDialog
          gameStatus={gameStatus}
          time={time}
          difficulty={difficulty}
          onNewGame={handleNewGame}
          onChangeDifficulty={changeDifficulty}
        />
      </div>
      <Footer />
    </Suspense>
  );
}
