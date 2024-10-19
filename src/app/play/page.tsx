"use client";
import React, { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { GameBoard } from "@/components/game-board";
import { GameControls } from "@/components/game-controls";
import { NumberPad } from "@/components/number-pad";
import {
  Board,
  Cell,
  Difficulty,
  boardToString,
  generateSudokuWithMetrics,
  isBoardComplete,
} from "@/lib/sudoku";
import { Navbar } from "@/components/Navbar";
import { Settings } from "@/components/Settings";
import { Footer } from "@/components/Footer";
import GameEndDialog from "@/components/game-end";

export default function SudokuGame() {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [board, setBoard] = useState<Board>(() => {
    const { board } = generateSudokuWithMetrics("easy");
    return board;
  });
  const [solution, setSolution] = useState<Board>(() => {
    const { solution } = generateSudokuWithMetrics("easy");
    return solution;
  });
  const [initialBoard, setInitialBoard] = useState<Board>(() =>
    board.map((row) => [...row])
  );
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

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Memoized handleNumberInput function
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

  // const handleNumberInput = (num: number): void => {
  //   if (selectedCell && isRunning && gameStatus === "playing") {
  //     const { row, col } = selectedCell;
  //     if (initialBoard[row][col] !== 0) return; // Don't allow changing initial numbers

  //     const newBoard = board.map((r) => [...r]);
  //     newBoard[row][col] = num;

  //     // Only count mistakes if the input is not 0 (deletion) and the number is wrong
  //     if (num !== 0 && num !== solution[row][col]) {
  //       setMistakes((prev) => {
  //         const newMistakes = prev + 1;
  //         if (newMistakes >= settings.maxMistakes) {
  //           setGameStatus("lost");
  //           setIsRunning(false);
  //         }
  //         return newMistakes;
  //       });
  //     }

  //     setBoard(newBoard);
  //     setHistory([...history.slice(0, historyIndex + 1), newBoard]);
  //     setHistoryIndex(historyIndex + 1);

  //     if (isBoardComplete(newBoard)) {
  //       setGameStatus("won");
  //       setIsRunning(false);
  //     }
  //   }
  // };

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

  const handleNewGame = (): void => {
    const { board, solution } = generateSudokuWithMetrics(difficulty);
    setBoard(board);
    setSolution(solution);
    setInitialBoard(board.map((row) => [...row]));
    setTime(0);
    setHistory([board]);
    setHistoryIndex(0);
    setIsRunning(true);
    setMistakes(0);
    setGameStatus("playing");
  };

  const togglePause = (): void => {
    if (gameStatus === "playing") {
      setIsRunning(!isRunning);
    }
  };

  const changeDifficulty = (newDifficulty: Difficulty): void => {
    setDifficulty(newDifficulty);
    handleNewGame();
  };

  // const handleHint = (): void => {
  //   if (selectedCell && isRunning && gameStatus === "playing") {
  //     const { row, col } = selectedCell;
  //     if (board[row][col] === 0) {
  //       const newBoard = board.map((r) => [...r]);
  //       newBoard[row][col] = solution[row][col];
  //       setBoard(newBoard);
  //       setHistory([...history.slice(0, historyIndex + 1), newBoard]);
  //       setHistoryIndex(historyIndex + 1);
  //     }
  //   }
  // };

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
            settings={settings}
            onSettingsChange={setSettings}
            mistakes={mistakes}
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
          <div className="text-xs text-muted-foreground/40 py-2 text-center mx-auto">
            {boardToString(board)}
          </div>

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
        />
      </div>
      <Footer />
    </>
  );
}
