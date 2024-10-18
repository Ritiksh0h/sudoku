"use client";

import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { GameBoard } from "@/components/game-board";
import { GameControls } from "@/components/game-controls";
import { NumberPad } from "@/components/number-pad";
import {
  Board,
  Cell,
  Difficulty,
  boardToString,
  generateSudokuWithMetrics,
  isSafe,
} from "@/lib/sudoku";
import { Navbar } from "@/components/Navbar";
import { Settings } from "@/components/Settings";
import { Footer } from "@/components/Footer";

export default function SudokuGame() {
  const [time, setTime] = useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [board, setBoard] = useState<Board>(() =>
    generateSudokuWithMetrics("easy")
  );
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

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRunning && settings.displayTimer && gameStatus === "playing") {
      timer = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRunning, settings.displayTimer, gameStatus]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const handleCellClick = (rowIndex: number, colIndex: number): void => {
    if (isRunning && gameStatus === "playing") {
      setSelectedCell({ row: rowIndex, col: colIndex });
    }
  };

  const handleNumberInput = (num: number): void => {
    if (selectedCell && isRunning && gameStatus === "playing") {
      const { row, col } = selectedCell;
      if (initialBoard[row][col] !== 0) return; // Don't allow changing initial numbers

      const newBoard = board.map((r) => [...r]);
      newBoard[row][col] = num;

      if (num !== 0 && !isSafe(initialBoard, row, col, num)) {
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
  };

  const isBoardComplete = (board: Board): boolean => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (
          board[row][col] === 0 ||
          !isSafe(board, row, col, board[row][col])
        ) {
          return false;
        }
      }
    }
    return true;
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

  const handleNewGame = (): void => {
    const newBoard = generateSudokuWithMetrics(difficulty);
    setBoard(newBoard);
    setInitialBoard(newBoard.map((row) => [...row]));
    setTime(0);
    setHistory([newBoard]);
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
          />

          <NumberPad
            isRunning={isRunning}
            gameStatus={gameStatus}
            onNumberInput={handleNumberInput}
          />
        </div>

        {gameStatus !== "playing" && (
          <Dialog open={true}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {gameStatus === "won" ? "Congratulations!" : "Game Over"}
                </DialogTitle>
              </DialogHeader>
              <div className="text-center">
                <p>
                  {gameStatus === "won"
                    ? "You solved the puzzle!"
                    : "You reached the maximum number of mistakes."}
                </p>
                <p>Time: {formatTime(time)}</p>
                <p>Difficulty: {difficulty}</p>
              </div>
              <DialogFooter>
                <Button onClick={handleNewGame}>New Game</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
      <Footer />
    </>
  );
}
