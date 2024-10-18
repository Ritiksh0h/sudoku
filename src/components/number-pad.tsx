import React from "react"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

interface NumberPadProps {
  isRunning: boolean
  gameStatus: 'playing' | 'won' | 'lost'
  onNumberInput: (num: number) => void
}

export function NumberPad({ isRunning, gameStatus, onNumberInput }: NumberPadProps) {
  return (
    <div className="mt-4 grid grid-cols-5 gap-2">
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
        <Button
          variant="outline"
          size="lg"
          key={num}
          className="text-xl font-semibold"
          onClick={() => onNumberInput(num)}
          disabled={!isRunning || gameStatus !== 'playing'}
        >
          {num}
        </Button>
      ))}
      <Button
        size="lg"
        variant="outline"
        onClick={() => onNumberInput(0)}
        disabled={!isRunning || gameStatus !== 'playing'}
      >
        <Trash2 size={24} />
      </Button>
    </div>
  )
}