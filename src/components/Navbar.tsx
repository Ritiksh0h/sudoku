"use client";
import React, { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Menu,
  ChevronRight,
  PencilLine,
  RotateCcw,
  X,
} from "lucide-react";
import { Settings, SettingsDialog } from "./Settings";
import ShareSudokuDialog from "./share-dialog";
import { Difficulty } from "@/lib/sudoku";

interface NavbarProps {
  difficulty: Difficulty;
  onChangeDifficulty: (difficulty: Difficulty) => void;
  onNewGame: () => void;
  onRestartGame: () => void;
  settings: Settings;
  onSettingsChange: (newSettings: Settings) => void;
  mistakes: number;
  onCodeEntered: (code: string) => void;
  shareCode: string;
}

export function Navbar({
  mistakes,
  onChangeDifficulty,
  // onNewGame,
  settings,
  onSettingsChange,
  difficulty,
  onRestartGame,
  onCodeEntered,
  shareCode,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = React.useState(false);

  return (
    <div className="flex justify-between items-center mb-4 px-4 py-2 bg-muted rounded-lg">
      <div className="flex justify-between items-center gap-4">
        <DropdownMenu open={menuOpen} onOpenChange={setMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Menu size={24} className="cursor-pointer" />
          </DropdownMenuTrigger>
          <DropdownMenuContent>
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
            <DropdownMenuItem onSelect={onRestartGame}>
              <RotateCcw className="mr-1" /> Restart game
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={(event) => event.preventDefault()}>
              <EnterCodeDialog
                onCodeEntered={(code) => {
                  onCodeEntered(code);
                  setMenuOpen(false);
                }}
              />
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
        <ShareSudokuDialog shareCode={shareCode} />
        <SettingsDialog
          settings={settings}
          onSettingsChange={onSettingsChange}
        />
      </div>
    </div>
  );
}

interface EnterCodeDialogProps {
  onCodeEntered: (code: string) => void;
}

export function EnterCodeDialog({ onCodeEntered }: EnterCodeDialogProps) {
  const [code, setCode] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = () => {
    onCodeEntered(code);
    setOpen(false);
    setCode("");
  };

  return (
    <>
      <Button
        variant="ghost"
        className="p-0 h-auto"
        onClick={() => setOpen(true)}
      >
        <PencilLine className="mr-1" /> Enter code
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter Sudoku Code</DialogTitle>
            <DialogDescription>
              Enter a valid Sudoku code to load a specific puzzle.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              id="code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Enter Sudoku code"
            />
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              Load Puzzle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
