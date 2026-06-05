"use client";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Suspense,
} from "react";
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

function SudokuGame() {
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
  const firstGame = useMemo(() => generateSudokuWithMetrics("easy"), []);

  const [board, setBoard] = useState<Board>(() =>
    firstGame.board.map((row) => [...row])
  );
  const [solution, setSolution] = useState<Board>(() =>
    firstGame.solution.map((row) => [...row])
  );
  const [initialBoard, setInitialBoard] = useState<Board>(() =>
    firstGame.board.map((row) => [...row])
  );
  const [sudoku, setSudoku] = useState(firstGame.sudoku);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [hintsRemaining, setHintsRemaining] = useState<number>(
    settings.numberOfHints
  );

  useEffect(() => {
    setIsClient(true);
  }, []);

  const generateGameUrl = (code: string) => {
    const baseUrl = window.location.origin;
    return `${baseUrl}${pathname}?code=${encodeURIComponent(code)}`;
  };

  const handleCodeEntered = useCallback(
    (code: string) => {
      try {
        const decodedSudoku = compactStringToSudoku(code);
        setBoard(decodedSudoku.puzzle);
        setSolution(decodedSudoku.solution);
        setInitialBoard(decodedSudoku.puzzle.map((row) => [...row]));
        setHistory([decodedSudoku.puzzle]);
        setHistoryIndex(0);
        setDifficulty(decodedSudoku.difficulty);
        setTime(0);
        setIsRunning(true);
        setMistakes(0);
        setGameStatus("playing");
        setHintsRemaining(settings.numberOfHints);
        toast({
          title: "Puzzle Loaded",
          description: "The Sudoku puzzle has been successfully loaded.",
        });
      } catch {
        toast({
          title: "Error",
          description: "Invalid Sudoku code. Please try again.",
          variant: "destructive",
        });
      }
    },
    [toast, settings.numberOfHints]
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
    if (isRunning && !isDialogOpen && settings.displayTimer && gameStatus === "playing") {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, isDialogOpen, settings.displayTimer, gameStatus]);

  useEffect(() => {
    if (settings.limitHints) {
      setHintsRemaining(settings.numberOfHints);
    }
  }, [settings.limitHints, settings.numberOfHints]);

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
    const generated = generateSudokuWithMetrics(newDifficulty || difficulty);
    setBoard(generated.board);
    setSolution(generated.solution);
    setInitialBoard(generated.board.map((row) => [...row]));
    setSudoku(generated.sudoku);
    setTime(0);
    setHistory([generated.board]);
    setHistoryIndex(0);
    setIsRunning(true);
    setMistakes(0);
    setGameStatus("playing");
    setSelectedCell(null);
    setHintsRemaining(settings.numberOfHints);
    if (newDifficulty) {
      setDifficulty(newDifficulty);
    }
    const newCode = sudokuToCompactString(generated.sudoku);
    const newUrl = generateGameUrl(newCode);
    router.push(newUrl);
    toast({
      title: "New Game",
      description: "A new Sudoku puzzle has been generated.",
    });
  };

  const handleRestartGame = (): void => {
    setBoard(initialBoard.map((row) => [...row]));
    setTime(0);
    setHistory([initialBoard.map((row) => [...row])]);
    setHistoryIndex(0);
    setIsRunning(true);
    setMistakes(0);
    setGameStatus("playing");
    setSelectedCell(null);
    setHintsRemaining(settings.numberOfHints);
  };

  const handleHint = useCallback((): void => {
    if (!isRunning || gameStatus !== "playing") return;
    if (settings.limitHints && hintsRemaining <= 0) return;

    const emptyCells: [number, number][] = [];
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] !== solution[r][c]) {
          emptyCells.push([r, c]);
        }
      }
    }
    if (emptyCells.length === 0) return;

    const [row, col] = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = board.map((r) => [...r]);
    newBoard[row][col] = solution[row][col];

    setBoard(newBoard);
    setHistory([...history.slice(0, historyIndex + 1), newBoard]);
    setHistoryIndex(historyIndex + 1);

    if (settings.limitHints) {
      setHintsRemaining((h) => h - 1);
    }

    setTime((t) => t + 30);

    toast({
      title: "Hint Used",
      description: settings.limitHints
        ? `${hintsRemaining - 1} hints remaining. +30s penalty added.`
        : "+30s penalty added.",
    });

    if (isBoardComplete(newBoard)) {
      setGameStatus("won");
      setIsRunning(false);
    }
  }, [
    isRunning, gameStatus, board, solution, history, historyIndex,
    settings.limitHints, hintsRemaining, toast,
  ]);

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
    <>
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
            onDialogOpenChange={setIsDialogOpen}
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
            hintsRemaining={hintsRemaining}
            onHint={handleHint}
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
    </>
  );
}

export default function Page() {
  return (
    <Suspense>
      <SudokuGame />
    </Suspense>
  );
}
