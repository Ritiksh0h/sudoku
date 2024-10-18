import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  ChevronRight,
  PencilLine,
  RotateCcw,
  X,
} from "lucide-react";
import { Settings, SettingsDialog } from "./Settings";
import ShareSudokuDialog from "./share-dialog";

type Difficulty = "easy" | "medium" | "hard" | "expert";

interface NavbarProps {
  difficulty: Difficulty;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
  mistakes: number;
}

export function Navbar({
  mistakes,
  onChangeDifficulty,
  onNewGame,
  settings,
  onSettingsChange,
  difficulty,
}: NavbarProps) {
  return (
    <div className="flex justify-between items-center mb-4 px-4 py-2 bg-muted rounded-lg">
      <div className="flex justify-between items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Menu size={24} className="cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>New game</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {["easy", "medium", "hard", "expert"].map((diff, i) => (
              <DropdownMenuItem
                key={i}
                className="capitalize"
                onSelect={() => onChangeDifficulty(diff as Difficulty)}
              >
                <ChevronRight className="mr-1" /> {diff}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={onNewGame}>
              <RotateCcw className="mr-1" /> Restart game
            </DropdownMenuItem>
            <DropdownMenuItem>
              <PencilLine className="mr-1" /> Enter code
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <h1 className="text-xl font-semibold">
          Sudoku{" "}
          <span className="text-lg text-muted-foreground">
            ({difficulty.charAt(0).toUpperCase() + difficulty.slice(1)})
          </span>
        </h1>
      </div>
      <div className="flex items-center text-lg">
        <X className="text-red-500 mr-1" size={24} />
        <span>
          {mistakes}/{settings.maxMistakes}
        </span>
      </div>
      <div className="flex justify-between items-center gap-4">
        <ShareSudokuDialog shareCode="" />
        <SettingsDialog
          settings={settings}
          onSettingsChange={onSettingsChange}
        />
      </div>
    </div>
  );
}
