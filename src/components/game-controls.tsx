import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pause, Play, Undo2, Redo2, Pen } from "lucide-react";

interface GameControlsProps {
  isRunning: boolean;
  gameStatus: "playing" | "won" | "lost";
  settings: {
    displayTimer: boolean;
    limitHints: boolean;
    numberOfHints: number;
  };
  time: number;
  mistakes: number;
  maxMistakes: number;
  onTogglePause: () => void;
  onUndo: () => void;
  onRedo: () => void;
  // onHint: () => void
}

export function GameControls({
  isRunning,
  gameStatus,
  settings,
  time,
  onTogglePause,
  onUndo,
  onRedo,
}: // onHint,
GameControlsProps) {
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div className="mt-4 flex justify-between bg-muted items-center rounded-lg py-2 px-4">
      <div className="flex justify-between items-center gap-4">
        <Button
          variant="outline"
          className="flex items-center space-x-2"
          onClick={onTogglePause}
          disabled={gameStatus !== "playing"}
        >
          {isRunning ? <Pause size={28} /> : <Play size={28} />}
        </Button>
        {settings.displayTimer && <span className="">{formatTime(time)}</span>}
      </div>

      <div className="flex space-x-4 items-center">
        <Button
          variant="outline"
          onClick={onUndo}
          disabled={!isRunning || gameStatus !== "playing"}
        >
          <Undo2 size={28} />
        </Button>
        <Button
          variant="outline"
          onClick={onRedo}
          disabled={!isRunning || gameStatus !== "playing"}
        >
          <Redo2 size={28} />
        </Button>

        {/* <Button
          variant="outline"
          className="relative"
          onClick={onHint}
          disabled={
            !isRunning ||
            (settings.limitHints && settings.numberOfHints <= 0) ||
            gameStatus !== "playing"
          }
        >
          <Lightbulb size={28} />
          {settings.limitHints && (
            <Badge className="absolute -top-2 -right-2">
              {settings.numberOfHints}
            </Badge>
          )}
        </Button> */}

        <Button
          variant="outline"
          className="relative"
          disabled={!isRunning || gameStatus !== "playing"}
        >
          <Pen size={24} />
          <Badge className="absolute -top-2 -right-2">off</Badge>
        </Button>
      </div>
    </div>
  );
}
