import React from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface NumberPadProps {
  isRunning: boolean;
  gameStatus: "playing" | "won" | "lost";
  onNumberInput: (num: number) => void;
  board: number[][];
}

export function NumberPad({
  isRunning,
  gameStatus,
  onNumberInput,
  board,
}: NumberPadProps) {
  const getDisabledNumbers = () => {
    const numberCounts = Array(10).fill(0);
    board.forEach((row) => {
      row.forEach((num) => {
        if (num !== 0) {
          numberCounts[num]++;
        }
      });
    });
    return numberCounts.map((count) => count >= 9);
  };

  const disabledNumbers = getDisabledNumbers();

  return (
    <div className="mt-4 grid grid-cols-5 gap-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <Button
          variant="outline"
          size="lg"
          key={num}
          className="text-xl font-semibold"
          onClick={() => onNumberInput(num)}
          disabled={
            !isRunning || gameStatus !== "playing" || disabledNumbers[num]
          }
        >
          {num}
        </Button>
      ))}
      <Button
        size="lg"
        variant="outline"
        onClick={() => onNumberInput(0)}
        disabled={!isRunning || gameStatus !== "playing"}
      >
        <Trash2 size={24} />
      </Button>
    </div>
  );
}
